import { useCallback, useEffect, useState } from "react"
import { useSelector } from 'react-redux';
import { io } from "socket.io-client"
import { Link, useNavigate, useParams } from "react-router-dom"
import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.min.css';
import axios from "axios";

import './table.css'

const SAVE_INTERVAL_MS = 2000

let myColumns = [
    {
        data: '0',
        type: 'text'
    }
]

const findCell = (col, row) => {
    const elementsInRange = document.querySelectorAll(`[aria-colindex="${col + 2}"]`)

    const filteredElements = Array.from(elementsInRange).filter(elem =>
        elem.parentElement?.getAttribute('aria-rowindex') == row + 2
    )

    return filteredElements[0]
}

const TableHolder = ({room, users, allTables}) => {
    const { roomId, tableId } = useParams()

    const [socket, setSocket] = useState()
    const [table, setTable] = useState()
    const [dataTable, setDataTable] = useState(["Loading..."])
    const [tableName, setTableName] = useState(null)
    const [updateTables, setUpdateTables] = useState(false)
    const [rowAndCol, setRowAndCol] = useState([]);

    let editUser = true

    const token = localStorage.getItem('token');
    const userId = useSelector((state) => state.user).id;
    const navigate = useNavigate();


    useEffect(() => {
        const s = io("http://158.160.147.53:6969", {
            extraHeaders: {
                "x-auth-token": token,
                "Authorization": token
            }
        })
        setSocket(s)
        localStorage.setItem('roomId', roomId)

        setDataTable([
            "English",
            "I'm a hero",
            "I'm a villain",
            "I'm a boy",
            "I'm a girl",
            "I'm a man",
            "I'm a women",
            "I'm a cat",
            "I'm a dog",
            "I'm a bird",
            "I'm a animal"
        ])

        return () => {
            s.disconnect()
        }
    }, [])

    useEffect(() => {
        if (socket == null || table == null || dataTable[0] === "Loading..." || users == null || userId == null) return

        socket.once("load-document", (tableExist, data, columns, name) => {
            if (!tableExist) return

            if (data === null) {
                table.loadData(dataTable.map(items => ({0: items})))
            } else {
                table.loadData(data)
                myColumns = columns
            }

            setTableName(name)

            table.updateSettings({
                columns: myColumns
            })

            const dataRowAndCol = users.map((item) => ({id: item._id, row: null, col: null}))
            setRowAndCol(dataRowAndCol)
        })

        socket.emit("get-document", tableId, roomId)
    }, [socket, table, tableId, roomId, dataTable, users, userId])

    useEffect(() => {
        if (socket == null || table == null) return

        const interval = setInterval(() => {
            socket.emit("save-document", table.getSourceData(), myColumns)
        }, SAVE_INTERVAL_MS)

        return () => {
            clearInterval(interval)
        }
    }, [socket, table])

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
        if (socket == null || table == null) return

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
        }
        table.addHook('afterChange', handler)

        return () => {
            Handsontable.hooks.remove('afterChange', handler);
        }
    }, [socket, table])

    useEffect(() => {
        if (socket == null || table == null) return

        const handler = (row, col, id) => {
            const otherUser = rowAndCol.find((item) => item.id === id)

            if (otherUser.row !== null && otherUser.col !== null) {
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
    }, [socket, table])

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
        if (socket == null || table == null) return

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
    }, [socket, table])

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

    useEffect(() => {
        if (socket == null || table == null) return

        const handler = (cols, title) => {
            const activeEditor = table.getActiveEditor()
            const value = activeEditor == null ? null : activeEditor.getValue()
            const isOpen = activeEditor == null ? null : activeEditor._opened
            myColumns = cols

            table.setDataAtCell(0, myColumns.length - 1, title)
            table.updateSettings({
                columns: cols
            })

            if (activeEditor && isOpen) {
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

        table.setDataAtCell(0, myColumns.length - 1, title)
        table.updateSettings({
            columns: myColumns
        })

        socket.emit("send-cols", myColumns, title)
    }

    const addTable = async () => {
        const name = document.getElementById('333').value
        await axios.post(`http://158.160.147.53:6868/tables/addTable?roomId=${roomId}`, {name: name}, {
            headers: {
                "Authorization": "Bearer " + token
            }
        })
            .then(table => {
                window.location.pathname = `/room/${roomId}/table/${table.data.tableId}`
            })
    }

    const renameTable = async () => {
        const name = document.getElementById('1').value
        await axios.put(`http://158.160.147.53:6868/tables/renameTable?tableId=${tableId}`, {name: name}, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("x-auth-token")
            }
        })
            .then(() => {
                setTableName(name)
                setUpdateTables(prev => !prev)
            })
    }

    const wrapperRef = useCallback(wrapper => {
        if (wrapper == null) return

        wrapper.innerHTML = ""
        const editor = document.createElement("div")
        wrapper.append(editor)
        const t = new Handsontable(editor, {
            data: [
                dataTable
            ],
            colHeaders: true,
            rowHeaders: true,
            autoRowSize: true,
            trimWhitespace: false,
            fixedRowsTop: 1
        })

        setTable(t)
    }, [])

    const handleTableChange = (event) => {
        const tableId = event.target.value;
        if (tableId) {
            navigate(`/projects/${roomId}/table/${tableId}`);
        }
    }
    return (
        <div className="table-holder">
            <h3>Table name: {tableName}</h3>
            <div className="add-lang">
                <button onClick={addColumn}>Add Column</button>
                <input type={'text'} id={'999999999'}/>
            </div>
            <div className="table-picker">
                <select 
                    className="table-dropdown" 
                    onChange={handleTableChange}
                >
                    <option value="" disabled>Select a table</option>
                    {allTables && allTables.map((item) => (
                        <option key={item.id} value={item.id}>
                            {item.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="container" ref={wrapperRef}/>
        </div>
    )
}

export default TableHolder