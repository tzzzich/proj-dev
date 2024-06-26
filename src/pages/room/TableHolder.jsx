import { useCallback, useEffect, useState } from "react"
import { useSelector } from 'react-redux';
import { io } from "socket.io-client"
import { Link, useNavigate, useParams } from "react-router-dom"
import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.min.css';
import axios from "axios";

import EditIcon from './../../assets/icons/edit.svg?react'

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

const TableHolder = ({room, users, allTables, myRow, socket, table, setTable, changeName, tableName}) => {
    const { roomId, tableId } = useParams()
    const [updateTables, setUpdateTables] = useState(false)
    const [rowAndCol, setRowAndCol] = useState([]);
    const dataTable = ["Loading..."]

    let editUser = true

    const token = localStorage.getItem('token');
    const userId = useSelector((state) => state.user.id);
    const navigate = useNavigate();


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
            manualColumnResize: true,
            colWidths: 250,
            autoColumnSize: false,
            trimWhitespace: false,
            fixedRowsTop: 1,


        })

        setTable(t)
    }, [])

    const handleTableChange = (event) => {
        const tableId = event.target.value;
        if (tableId) {
            window.location.href=tableId;
        }
    }
    return (
        <div className="table-holder">
            <div className="table-info">
                <h2>Table name: {tableName} <EditIcon className="edit-icon" onClick={changeName}/></h2>
                <div className="table-picker">
                    <h3>Select table</h3>
                    <select 
                        className="table-dropdown" 
                        onChange={handleTableChange}
                    >
                        {allTables && allTables.map((item) => (
                            <option className='option' key={item.id} value={item.id} selected={item.id == tableId}>
                                {item.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="container" ref={wrapperRef}/>
        </div>
    )
}

export default TableHolder