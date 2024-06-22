import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTables, getUsers } from "../../utils/mock-api";

import TranslateIcon from './../../assets/icons/translate.svg?react';

import './room-page.css'

export default function RoomPage () {
    const { id } = useParams();

    const [users, setUsers] = useState([]);
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
          try {
            setLoading(true);
            const [usersResponse, tablesResponse ] = await Promise.all([getUsers(id), getTables(id)]);
            console.log(usersResponse, tablesResponse);
            setUsers(usersResponse.data);
            setTables(tablesResponse.data);
            setLoading(false);
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
    
        fetchData();
      }, []);
    return(
        <>
            <header className="room-header">
                <div style={{height: '100%'}}>
                    <button className="header-btn">+ Add User</button>
                    <button className="header-btn">+ Add Language</button>
                    <button className="header-btn">+ Add Table</button>
                </div>
                <div style={{height: '100%'}}>
                    <button className="header-btn translate"><TranslateIcon /> <span>Auto Translate</span></button>
                </div>
            </header>   
        </>
    );
}