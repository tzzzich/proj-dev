import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getRoom, getTables, getUsers } from "../../utils/api/requests";

import TranslateIcon from './../../assets/icons/translate.svg?react';
import EditIcon from "./../../assets/icons/edit.svg?react";

import './room-page.css'
import TableHolder from "./TableHolder";
import Modal from "../../components/ui/modal/Modal";
import JoinForm from "../projects/JoinForm";
import ChangeRoomNameForm from "./ChangeRoomNameForm";

export default function RoomPage () {
    const { roomId, tableId } = useParams();

    const [showRenameRoomModal, setShowRenameRoomModal] = useState(false);

    function toggleRenameRoomModal() {
      setShowRenameRoomModal(!showRenameRoomModal);
    }

    const [users, setUsers] = useState([]);
    const [room, setRoom] = useState();
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(false);

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
            setTables(tablesResponse.tables);
            setLoading(false);
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
    
        fetchData();
      }, []);

      function updateName(data) {
        setRoom({...room, name: data.name})
      }

    return(
        loading ? 
        (<h2>Loading..</h2>) 
        :
        (
          <div className="room">
              <header className="room-header">
                  <div className="part">
                      <button className="header-btn change" onClick={toggleRenameRoomModal}>Room: {room?.name} <EditIcon/></button>
                      <button className="header-btn">+ Add User</button>
                      <button className="header-btn">+ Add Language</button>
                      <button className="header-btn">+ Add Table</button>
                  </div>
                  <div className="part">
                      <button className="header-btn translate"><TranslateIcon /> <span>Auto Translate</span></button>
                      <button className="header-btn translate"><TranslateIcon /> <span>Auto Translate</span></button>
                      <button className="header-btn translate"><TranslateIcon /> <span>Auto Translate</span></button>
                  </div>
              </header>   
              <TableHolder room={room} allTables={tables} users={users}/>
              <Modal show={showRenameRoomModal} onClose={toggleRenameRoomModal}>
                  <ChangeRoomNameForm closeModal={toggleRenameRoomModal} updateName={updateName} currentName={room?.name}/>
              </Modal>

          </div>
        )
    );
}