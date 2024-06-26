import { getRoom, getTables, getUsers } from "../../utils/api/requests";

import {useEffect, useState} from "react"
import {io} from "socket.io-client"
import {useNavigate, useParams} from "react-router-dom"
import 'handsontable/dist/handsontable.full.min.css';
import axios from "axios";

import TranslateIcon from './../../assets/icons/translate.svg?react';
import EditIcon from "./../../assets/icons/edit.svg?react";
import DownloadIcon from "./../../assets/icons/download.svg?react";
import UserAddIcon from "./../../assets/icons/user-add.svg?react";

import './room-page.css'
import TableHolder from "./TableHolder";
import Modal from "../../components/ui/modal/Modal";
import ChangeRoomNameForm from "./ChangeRoomNameForm";
import DropdownMenu from "../../components/dropdown-menu/DropdownMenu";
import AddUserForm from "./AddUserForm";
import RenameTableForm from "./RenameTableForm";
import LanguagePickForm from "./LanguagePickForm";
import DropdownOptions from "../../components/dropdown-menu/Dropdown.Options";
import swal from "sweetalert";
import AddForm from "./AddForm";
import Handsontable from "handsontable";
import SaveFile from "./SaveFile.jsx";

let myColumns = [
    {
        data: '0',
        type: 'text'
    }
]
let myRow = []
let editUser = true

const parseJWT = (token) => {
    if (token == null) return null

    const base64Url = token.split(".")[1]

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')

    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(''));

    return JSON.parse(jsonPayload)
}

const findCell = (col, row) => {
    const elementsInRange = document.querySelectorAll(`[aria-colindex="${col + 2}"]`)

    const filteredElements = Array.from(elementsInRange).filter(elem =>
        elem.parentElement?.getAttribute('aria-rowindex') == row + 2
    )

    return filteredElements[0]
}

export default function RoomPage () {

  const { roomId, tableId } = useParams()
  const [socket, setSocket] = useState(null)
  const [table, setTable] = useState(null)
  const [allTables, setAllTables] = useState(null)
  const [users, setUsers] = useState(null)
  const [tableName, setTableName] = useState(null)
  const [room, setRoom] = useState(null)
  const [updateTables, setUpdateTables] = useState(false)
  const [updateUsers, setUpdateUsers] = useState(false)
  const [rowAndCol, setRowAndCol] = useState(null)
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState();
  const [userId, setUserId] = useState(null)

  const navigate = useNavigate();


  useEffect(() => {
      const s = io("http://158.160.147.53:6969", {
          extraHeaders: {
              "x-auth-token": localStorage.getItem("token"),
              "Authorization": localStorage.getItem("token")
          }
      })
      setSocket(s)

      const jsonToken = parseJWT(localStorage.getItem("token"))
      setUserId(jsonToken == null ? null : jsonToken.userId)

      return () => {
          s.disconnect()
      }
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        //setLoading(true);
        const [usersResponse, roomResponse, tablesResponse ] = await Promise.all(
          [getUsers(roomId), getRoom(roomId), getTables(roomId)]
        );
        console.log(usersResponse, roomResponse, tablesResponse);
        setUsers(usersResponse.users);
        setRoom(roomResponse);
        setAllTables(tablesResponse.tables);
        setIsAdmin(userId === roomResponse.creator);
        localStorage.setItem('roomId', roomResponse.id)
        //setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [updateTables, updateUsers, userId]);//РАЗДЕЛИТЬ

  useEffect(() => {
    if (socket == null || table == null || users == null || userId == null) return

    socket.once("load-document", (tableExist, data, columns, name) => {
        if (!tableExist) return

        myRow = data
        table.loadData(data)
        myColumns = columns

        setTableName(name)

        table.updateSettings({
            columns: myColumns
        })

        setRowAndCol(users.map((item) => ({id: item._id, row: null, col: null})))
    })

    socket.emit("get-document", tableId, roomId)
  }, [socket, table, tableId, users, userId])

  useEffect(() => {
      if (socket == null || table == null || rowAndCol == null) return

      const handler = (cols, data) => {
          const activeEditor = table.getActiveEditor()
          const value = activeEditor == null ? null : activeEditor.getValue()
          const isOpen = activeEditor == null ? null : activeEditor._opened
          myColumns = cols

          table.updateSettings({
              columns: cols,
              data: data
          })

          rowAndCol.map((item) => {
              if (item.col == null || item.row == null) return

              const filteredElements = findCell(item.col, item.row)
              filteredElements.classList.add('cell-with-custom-border')
          })

          if (activeEditor && isOpen) {
              if (activeEditor.col === myColumns.length - 2) activeEditor.col = myColumns.length - 1

              activeEditor.beginEditing();
              activeEditor.setValue(value)
          }
      }
      socket.on("receive-cols", handler)

      return () => {
          socket.off("receive-cols", handler)
      }
  }, [socket, table, rowAndCol])

    useEffect(() => {
        if (socket == null || table == null) return

        const handler = delta => {
            editUser = false

            const activeEditor = table.getActiveEditor()
            const value = activeEditor == null ? null : activeEditor.getValue()
            const isOpen = activeEditor == null ? null : activeEditor._opened

            table.setDataAtCell(delta[0], delta[1], delta[2])

            if (activeEditor && isOpen) {
                activeEditor.beginEditing();
                activeEditor.setValue(value)
            }
        }
        socket.on("receive-changes", handler)

        return () => {
            socket.off("receive-changes", handler)
        }
    }, [socket, table])

    useEffect(() => {
        if (socket == null || table == null || rowAndCol == null) return

        const handler = (changes, source) => {
            if (source !== "edit") return

            rowAndCol.map((item) => {
                if (item.col == null || item.row == null) return

                const filteredElements = findCell(item.col, item.row)
                filteredElements.classList.add('cell-with-custom-border')
            })

            if (!editUser) {
                editUser = true
                return
            }

            socket.emit("send-changes", [changes[0][0], table.propToCol(changes[0][1]), changes[0][3]])
            socket.emit("save-document", table.getSourceData(), myColumns)
        }
        table.addHook('afterChange', handler)

        return () => {
            Handsontable.hooks.remove('afterChange', handler);
        }
    }, [socket, table, rowAndCol])

    useEffect(() => {
        if (socket == null || table == null || rowAndCol == null) return

        const handler = (row, col, id) => {
            const otherUser = rowAndCol.find((item) => item.id === id)

            if (otherUser != null && otherUser.row != null && otherUser.col != null) {
                const oldElements = findCell(otherUser.col, otherUser.row)
                oldElements.classList.remove('cell-with-custom-border')
            }

            const filteredElements = findCell(col, row)
            filteredElements.classList.add('cell-with-custom-border')

            otherUser.col = col
            otherUser.row = row
        }
        socket.on("set-color", handler)

        return () => {
            socket.off("set-color", handler)
        }
    }, [socket, table, rowAndCol])

    useEffect(() => {
        if (socket == null || table == null) return

        const handler = (row, col) => {
            socket.emit("click-mouse", row, col, userId)
        }

        table.addHook('afterSelection', handler)

        return () => {
            Handsontable.hooks.remove('afterSelection', handler);
        }
    }, [socket, table])

    useEffect(() => {
        if (socket == null || table == null || rowAndCol == null) return

        const handler = (id) => {
            const otherUser = rowAndCol.find((item) => item.id === id)

            if (otherUser.row !== null && otherUser.col !== null) {
                const oldElements = findCell(otherUser.col, otherUser.row)
                oldElements.classList.remove('cell-with-custom-border')
            }

            otherUser.col = null
            otherUser.row = null
        }
        socket.on("delete-color", handler)

        return () => {
            socket.off("delete-color", handler)
        }
    }, [socket, table, rowAndCol])

    useEffect(() => {
        if (socket == null || table == null) return

        const handler = () => {
            socket.emit("no-click-mouse", userId)
        }

        table.addHook('afterDeselect', handler)

        return () => {
            Handsontable.hooks.remove('afterDeselect', handler);
        }
    }, [socket, table])

  const [showRenameRoomModal, setShowRenameRoomModal] = useState(false);
  const [showRenameTableModal, setShowRenameTableModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showLangModal, setShowLangModal] = useState(false);
  const [showColModal, setShowColModal] = useState(false);
  const [showTableModal, setShowTableModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);

  function toggleRenameRoomModal() {
    setShowRenameRoomModal(!showRenameRoomModal);
  }
  function toggleShowColModal() {
    setShowColModal(!showColModal);
  }

  function toggleLangModal() {
    setShowLangModal(!showLangModal);
  }

  function toggleTableModal() {
    setShowTableModal(!showTableModal);
  }

  function toggleRenameTableModal() {
    setShowRenameTableModal(!showRenameTableModal);
  }

  function toggleAddUserModal() {
    setShowAddUserModal(!showAddUserModal);
  }

  function toggleSaveModal() {
      setShowSaveModal(!showSaveModal);
  }

  const addColumnWithTranslate = async (language) => {
    const languageFrom = language.languageFrom;
    const languageTo = language.languageTo;
    const translationCol = table.getActiveEditor().col
    const title = table.getSourceData()[0][translationCol] + "_Translation"

    if (title.includes("_Translation_Translation")) {
        await swal("Error!", "You can't translate something that has already been translated", "error");
        return
    }

    myColumns.push({});
    socket.emit("send-cols", myColumns, title, translationCol, languageFrom, languageTo)
  }

    const addColumn = (data) => {
        const title = data.title;
        myColumns.push({});
        socket.emit("send-cols", myColumns, title)
    }

    const deleteColumn = () => {
        if(myColumns.length <= 2) return

        for (const place of rowAndCol) {
            const len = myColumns.length
            if (place.col != null && place.col >= len - 2) return
        }

        myColumns.pop()
        socket.emit("send-cols", myColumns)
    }

  useEffect(() => {
      if (socket == null || table == null || rowAndCol == null) return

      const handler = (rows) => {
          const activeEditor = table.getActiveEditor()
          const value = activeEditor == null ? null : activeEditor.getValue()
          const isOpen = activeEditor == null ? null : activeEditor._opened
          myRow = rows

          table.updateSettings({
              data: rows
          })

          rowAndCol.map((item) => {
              if (item.col == null || item.row == null) return

              const filteredElements = findCell(item.col, item.row)
              filteredElements.classList.add('cell-with-custom-border')
          })

          if (activeEditor && isOpen) {
              activeEditor.beginEditing();
              activeEditor.setValue(value)
          }
      }
      socket.on("receive-rows", handler)

      return () => {
          socket.off("receive-rows", handler)
      }
  }, [socket, table, rowAndCol])

  const addRow = () => {
      myRow = table.getSourceData()

      myRow.push({});

      table.updateSettings({
          data: myRow
      })

      rowAndCol.map((item) => {
          if (item.col == null || item.row == null) return

          const filteredElements = findCell(item.col, item.row)
          filteredElements.classList.add('cell-with-custom-border')
      })

      socket.emit("send-rows", myRow)
      socket.emit("save-document", table.getSourceData(), myColumns)
  }

  const deleteRow = () => {
      myRow = table.getSourceData()

      if (myRow.length <= 1) return

      myRow.pop();

      for (const place of rowAndCol) {
          const len = table.getSourceData().length
          if (place.row != null && place.row >= len - 1) return
      }

      table.updateSettings({
          data: myRow
      })

      rowAndCol.map((item) => {
          if (item.col == null || item.row == null) return

          const filteredElements = findCell(item.col, item.row)
          filteredElements.classList.add('cell-with-custom-border')
      })

      socket.emit("send-rows", myRow)
      socket.emit("save-document", table.getSourceData(), myColumns)
  }

  const addTable = async (data) => {
        console.log(data.name);
      const name = data.name;
      const tables = {
          fileName: name,
          data: [table.getSourceData()[0]],
          columns: myColumns
      }
      await axios.post(`http://158.160.147.53:6868/tables/addTable?roomId=${roomId}`, {tableData: tables}, {
          headers: {
              "Authorization": "Bearer " + localStorage.getItem("token")
          }
      })
          .then(table => {
              socket.emit("send-tables")
              window.location.pathname = `/projects/${roomId}/table/${table.data.tableId}`
          })
  }

  const deleteTable = async () => {
    try{
      await axios.delete(`http://158.160.147.53:6868/tables/deleteTable?tableId=${tableId}`, {
          headers: {
              "Authorization": "Bearer " + localStorage.getItem("token")
          }
      })
          .then(() => {
              socket.emit("send-tables", tableId)
              window.location.pathname = `/projects/${roomId}/table/${room.main_table}`
          })
    }
    catch(error) {
      swal("Error!", error.response.data.error, "error");
    }
  }

  useEffect(() => {
      if (socket == null || table == null) return

      const handler = (name) => {
          setTableName(name)
      }
      socket.on("receive-table-name", handler)

      return () => {
          socket.off("receive-table-name", handler)
      }
  }, [socket, table])

  useEffect(() => {
      if (socket == null || table == null || room == null) return

      const handler = (tableId) => {
          setUpdateTables(prev => !prev)
          if (tableId !== undefined) window.location.pathname = `/projects/${roomId}/table/${room.main_table}`
      }
      socket.on("receive-tables", handler)

      return () => {
          socket.off("receive-tables", handler)
      }
  }, [socket, table, room])

  const renameTable = async (data) => {
    try {
      await axios.put(`http://158.160.147.53:6868/tables/renameTable?tableId=${tableId}`, data, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        })
            .then(() => {
                setTableName(data.name)
                setUpdateTables(prev => !prev)
                socket.emit("send-table-name", data.name)
                socket.emit("send-tables")
            })
    } catch(error) {
      throw error;
    }
  
  }

  useEffect(() => {
      if (socket == null || table == null || room == null) return

      const handler = (name) => {
          setRoom({...room, name: name})
      }
      socket.on("receive-room-name", handler)

      return () => {
          socket.off("receive-room-name", handler)
      }
  }, [socket, table, room])

  useEffect(() => {
      if (socket == null || table == null) return

      const handler = () => {
          setUpdateUsers(prev => !prev)
      }
      socket.on("receive-users", handler)

      return () => {
          socket.off("receive-users", handler)
      }
  }, [socket, table])


    function updateName(data) {
      setRoom({...room, name: data.name})
    }

    async function updateChildUsers() {
      setUpdateUsers(prev => !prev);
    }

    return(
        loading ? 
        (<h2>Loading..</h2>) 
        :
        (
          <div className="room">
              <header className="room-header">
                  <div className="part">
                      <button className="header-btn" onClick={() => {navigate('/projects')}}>{'< Go Back'}</button>
                      <button className="header-btn change" onClick={isAdmin && toggleRenameRoomModal}>Room: {room?.name} {isAdmin && <EditIcon/>}</button>
                      {isAdmin && <button className="header-btn" onClick={ toggleAddUserModal}><UserAddIcon className="icon"/> Add User</button>}
                      <DropdownOptions name={'Table'} onClick1={toggleTableModal} onClick2={deleteTable} socket={socket}/>
                      <DropdownOptions name={'Language'} onClick1={toggleShowColModal} onClick2={deleteColumn} socket={socket}/>
                      <DropdownOptions name={'Row'} onClick1={addRow} onClick2={deleteRow} socket={socket}/>
                  </div>
                  <div className="part">
                      <DropdownMenu items={users} socket={socket} isAdmin={isAdmin}/>
                      <button className="header-btn translate" onClick={toggleSaveModal}><DownloadIcon/> Download as MSBTs</button>
                      <button className="header-btn translate" onClick={toggleLangModal}><TranslateIcon /> Auto Translate</button>
                  </div>
              </header>   
              <TableHolder room={room} allTables={allTables} setTable={setTable} tableName={tableName}
                           changeName={toggleRenameTableModal} tableId={tableId}/>
              <Modal show={showRenameRoomModal} onClose={toggleRenameRoomModal} >
                  <ChangeRoomNameForm closeModal={toggleRenameRoomModal} updateName={updateName} currentName={room?.name} socket={socket}/>
              </Modal>
              <Modal show={showAddUserModal} onClose={toggleAddUserModal} >
                  <AddUserForm closeModal={toggleAddUserModal} updateUsers={updateChildUsers} socket={socket}/>
              </Modal>
              <Modal show={showRenameTableModal} onClose={toggleRenameTableModal} >
                  <RenameTableForm closeModal={toggleRenameTableModal} renameTable={renameTable} currentName={tableName} socket={socket}/>
              </Modal>
              <Modal show={showLangModal} onClose={toggleLangModal} >
                  <LanguagePickForm closeModal={toggleLangModal} changeLanguage={addColumnWithTranslate} socket={socket}/>
              </Modal>
              <Modal show={showColModal} onClose={toggleShowColModal} >
                  <AddForm closeModal={toggleShowColModal} func={addColumn} name='title' placeholder='Column title'/>
              </Modal>
              <Modal show={showTableModal} onClose={toggleTableModal} >
                  <AddForm closeModal={toggleTableModal} func={addTable} name='name' placeholder='Table name'/>
              </Modal>
              <Modal show={showSaveModal} onClose={toggleSaveModal} >
                  <SaveFile closeModal={toggleSaveModal} roomId={roomId} roomName={room != null ? room.name : ""}
                            usesMSBP={room != null ? room.usesMSBP : true}/>
              </Modal>
          </div>
        )
    );
}