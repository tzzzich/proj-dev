import { useCallback } from "react"
import { useParams } from "react-router-dom"
import Handsontable from 'handsontable';
import 'handsontable/dist/handsontable.full.min.css';

import EditIcon from './../../assets/icons/edit.svg?react'

import './table.css'

const TableHolder = ({room, allTables, setTable, changeName, tableName, tableId}) => {
    const dataTable = ["Loading..."]


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
            fixedRowsTop: 1
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
                <h4>Invitation code: {room?.invitation_code}</h4>
                <div className="table-picker">
                    <h3>Select table</h3>
                    <select 
                        className="table-dropdown" 
                        onChange={handleTableChange}
                    >
                        {allTables && allTables.map((item) => (
                            <option className='option' key={item.id} value={item.id} selected={item.id === tableId}>
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