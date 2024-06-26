import { getRoom, getTables, getUsers } from "../../utils/api/requests";
import {  useSelector } from 'react-redux';

import {useCallback, useEffect, useState} from "react"
import {io} from "socket.io-client"
import {useNavigate, useParams} from "react-router-dom"
import Handsontable from 'handsontable';
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

let editUser = true
let myColumns = [
    {
        data: '0',
        type: 'text'
    }
]
let myRow = []

const findCell = (col, row) => {
    const elementsInRange = document.querySelectorAll(`[aria-colindex="${col + 2}"]`)

    const filteredElements = Array.from(elementsInRange).filter(elem =>
        elem.parentElement?.getAttribute('aria-rowindex') == row + 2
    )

    return filteredElements[0]
}
function objectToArray(obj, length) {
    const arr = new Array(length).fill('');
    for (const key in obj) {
        arr[parseInt(key)] = obj[key];
    }
    return arr;
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
  const [isAdmin, setIsAdmin] = useState(false);

  const dataTable = ["Loading..."]
  const userId = useSelector((state) => state.user.id);
  const navigate = useNavigate();


  useEffect(() => {
      const s = io("http://158.160.147.53:6969", {
          extraHeaders: {
              "x-auth-token": localStorage.getItem("token"),
              "Authorization": localStorage.getItem("token")
          }
      })
      setSocket(s)

      return () => {
          s.disconnect()
      }
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [usersResponse, roomResponse, tablesResponse ] = await Promise.all(
          [getUsers(roomId), getRoom(roomId), getTables(roomId)]
        );
        console.log(usersResponse, roomResponse, tablesResponse);
        setUsers(usersResponse.users);
        setRoom(roomResponse);
        setAllTables(tablesResponse.tables);
        setIsAdmin(userId === roomResponse.creator);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [updateTables, updateUsers]);//РАЗДЕЛИТЬ 

  // useEffect(() => {
  //     async function fetchData() {
  //         const tablesResponse = await axios.get(`http://158.160.147.53:6868/rooms/getTables?roomId=${roomId}`, {
  //             headers: {
  //                 "Authorization": "Bearer " + localStorage.getItem("token")
  //             }
  //         });
  //         setAllTables(tablesResponse.data.tables);
  //     }

  //     fetchData();
  // }, [updateTables])

  // useEffect(() => {
  //     const getRoomUsers = async () => {
  //         const roomResponse = await axios.get(`http://158.160.147.53:6868/rooms/getUsers?roomId=${roomId}`, {
  //             headers: {
  //                 "Authorization": "Bearer " + localStorage.getItem("token")
  //             }
  //         })
  //         setUsers(roomResponse.data.users)
  //     }

  //     getRoomUsers();
  // }, [updateUsers])

  useEffect(() => {
      if (socket == null || table == null) return

      const handler = (cols, data) => {
          const activeEditor = table.getActiveEditor()
          const value = activeEditor == null ? null : activeEditor.getValue()
          const isOpen = activeEditor == null ? null : activeEditor._opened
          myColumns = cols

          table.updateSettings({
              columns: cols,
              data: data
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
  }, [socket, table])

  const addColumn = () => {
      const title = document.getElementById('999999999').value
      myColumns.push({});
      socket.emit("send-cols", myColumns, title)
  }


  const [showRenameRoomModal, setShowRenameRoomModal] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  function toggleRenameRoomModal() {
    setShowRenameRoomModal(!showRenameRoomModal);
  }

  function toggleAddUserModal() {
    setShowAddUserModal(!showAddUserModal);
  }

  // const addColumnWithTranslate = async () => {

  //     myRow = table.getSourceData()
  //     myRow = myRow.map((item) => {
  //         const arr = objectToArray(item, myColumns.length)
  //         arr.splice(arr.length - 1, 0, "")
  //         return Object.fromEntries(arr.map((value, index) => [index, value]))
  //     })
  //     var i;
  //     var textForTranslate = []
  //     for (i = 0; i < myRow.length; i++) {
  //         textForTranslate.push(myRow[i][4])

  //     }

  //     const roomResponse = await axios.post(`http://158.160.147.53:6868/translate/translate`, {sourceLanguageCode: "de", folderId: "b1gbi9p05hufm79d5rlo", texts: textForTranslate, targetLanguageCode: document.getElementById("selectlanguage").options[ document.getElementById("selectlanguage").selectedIndex ].value}, {
  //         headers: {
  //             "Authorization": "Bearer t1.9euelZqWx8ablp7HlJ6Xy5yXnpuLze3rnpWax56dm4zJy8jHmIvGy87Ki5vl9PdqKhVM-e9dKjiV3fT3KlkSTPnvXSo4lc3n9euelZrOjZOVlZzHnsjGlZaejcjMyu_8xeuelZrOjZOVlZzHnsjGlZaejcjMyg.eBRXiNZiaYbPYY5NHsqmmkDVac15GZF0rcNZZg3Zwzqvuein4foe0ba9OivbfkLAtrS32fVwNJA8YZP0kJsyBQ"
  //         }

  //     })
  //     console.log(roomResponse.data.message.translations)
  //     let translator = roomResponse.data.message.translations.map(item => item.text);

  //     console.log(translator);

  //     myColumns.push({})


  // }

  const deleteColumn = () => {
      if(myColumns.length <= 2) return
      myColumns.pop()
      socket.emit("send-cols", myColumns)
  }

  useEffect(() => {
      if (socket == null || table == null) return

      const handler = (rows) => {
          const activeEditor = table.getActiveEditor()
          const value = activeEditor == null ? null : activeEditor.getValue()
          const isOpen = activeEditor == null ? null : activeEditor._opened
          myRow = rows

          table.updateSettings({
              data: rows
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
  }, [socket, table])

  const addRow = () => {
      myRow.push({});

      table.updateSettings({
          data: myRow
      })

      socket.emit("send-rows", myRow)
      socket.emit("save-document", table.getSourceData(), myColumns)
  }

  const deleteRow = () => {
      if (myRow.length <= 1) return

      myRow.pop();

      table.updateSettings({
          data: myRow
      })

      socket.emit("send-rows", myRow)
      socket.emit("save-document", table.getSourceData(), myColumns)
  }

  const addTable = async () => {
      const name = document.getElementById('333').value
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
              window.location.pathname = `/room/${roomId}/table/${table.data.tableId}`
          })
  }

  const deleteTable = async () => {
      await axios.delete(`http://158.160.147.53:6868/tables/deleteTable?tableId=${tableId}`, {
          headers: {
              "Authorization": "Bearer " + localStorage.getItem("token")
          }
      })
          .then(() => {
              socket.emit("send-tables", tableId)
              window.location.pathname = `/room/${roomId}/table/${room.main_table}`
          })
  }

  // const deleteRoom = async () => {
  //     await axios.delete(`http://158.160.147.53:6868/rooms/deleteRoom?roomId=${roomId}`, {
  //         headers: {
  //             "Authorization": "Bearer " + localStorage.getItem("token")
  //         }
  //     })
  //         .then(() => {
  //             window.location.pathname = `/`
  //         })
  // }

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
          if (tableId !== undefined) window.location.pathname = `/room/${roomId}/table/${room.main_table}`
      }
      socket.on("receive-tables", handler)

      return () => {
          socket.off("receive-tables", handler)
      }
  }, [socket, table, room])

  const renameTable = async () => {
      const name = document.getElementById('1').value
      await axios.put(`http://158.160.147.53:6868/tables/renameTable?tableId=${tableId}`, {name: name}, {
          headers: {
              "Authorization": "Bearer " + localStorage.getItem("token")
          }
      })
          .then(() => {
              setTableName(name)
              setUpdateTables(prev => !prev)
              socket.emit("send-table-name", name)
              socket.emit("send-tables")
          })
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

  const renameRoom = async () => {
      const name = document.getElementById('22').value
      await axios.put(`http://158.160.147.53:6868/rooms/renameRoom?roomId=${roomId}`, {name: name}, {
          headers: {
              "Authorization": "Bearer " + localStorage.getItem("token")
          }
      })
          .then(() => {
              setRoom({...room, name: name})
              socket.emit("send-room-name", name)
          })
  }

  const addUser = async () => {
      const email = document.getElementById('123456789').value
      await axios.post(`http://158.160.147.53:6868/rooms/addUser?roomId=${roomId}`, {email: email}, {
          headers: {
              "Authorization": "Bearer " + localStorage.getItem("token")
          }
      })
          .then(() => {
              setUpdateUsers(prev => !prev)
              socket.emit("send-users")
          })
  }

  const deleteUser = async () => {
      const id = document.getElementById('987654321').value
      await axios.delete(`http://158.160.147.53:6868/rooms/deleteUserRoom?roomId=${roomId}&user_id=${id}`, {
          headers: {
              "Authorization": "Bearer " + localStorage.getItem("token")
          }
      })
          .then(() => {
              setUpdateUsers(prev => !prev)
              socket.emit("send-users")
          })
  }

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
      const newUsers = await getUsers(roomId);
      setUsers(newUsers.users);
    }


    // const { roomId, tableId } = useParams();
    // const navigate = useNavigate();
    // const user = useSelector((state) => state.user);
    // const [users, setUsers] = useState([]);
    // const [room, setRoom] = useState();
    // const [tables, setTables] = useState([]);
    // const [loading, setLoading] = useState(false);
    // const [isAdmin, setIsAdmin] = useState(false);

    return(
        loading ? 
        (<h2>Loading..</h2>) 
        :
        (
          <div className="room">
              <header className="room-header">
                  <div className="part">
                      <button className="header-btn" onClick={() => {navigate('/projects')}}>{'< Go Back'}</button>
                      <button className="header-btn change" onClick={toggleRenameRoomModal}>Room: {room?.name} <EditIcon/></button>
                      <button className="header-btn" onClick={toggleAddUserModal}><UserAddIcon className="icon"/> Add User</button>
                      <button className="header-btn">+ Add Table</button>
                  </div>
                  <div className="part">
                      <DropdownMenu items={users}/>
                      <button className="header-btn translate"><DownloadIcon/> Download as MSBTs</button>
                      <button className="header-btn translate"><TranslateIcon /> Auto Translate</button>
                  </div>
              </header>   
              <TableHolder room={room} allTables={allTables} users={users} myRow={myRow} socket={socket} table={table} setTable={setTable}/>
              <Modal show={showRenameRoomModal} onClose={toggleRenameRoomModal}>
                  <ChangeRoomNameForm closeModal={toggleRenameRoomModal} updateName={updateName} currentName={room?.name}/>
              </Modal>
              <Modal show={showAddUserModal} onClose={toggleAddUserModal}>
                  <AddUserForm closeModal={toggleAddUserModal} updateUsers={updateChildUsers}/>
              </Modal>

          </div>
        )
    );
}