import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getRoom, getTables, getUsers } from "../../utils/api/requests";
import {  useSelector } from 'react-redux';

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

export default function RoomPage () {
    const { roomId, tableId } = useParams();
    const navigate = useNavigate();
    const user = useSelector((state) => state.user);

    const [showRenameRoomModal, setShowRenameRoomModal] = useState(false);
    const [showAddUserModal, setShowAddUserModal] = useState(false);

    function toggleRenameRoomModal() {
      setShowRenameRoomModal(!showRenameRoomModal);
    }

    function toggleAddUserModal() {
      setShowAddUserModal(!showAddUserModal);
    }
    const [users, setUsers] = useState([]);
    const [room, setRoom] = useState();
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

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
            setIsAdmin(user.id === roomResponse.creator);
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

      function updateUsers(data) {
        setUsers({...users, data})
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
              <TableHolder room={room} allTables={tables} users={users}/>
              <Modal show={showRenameRoomModal} onClose={toggleRenameRoomModal}>
                  <ChangeRoomNameForm closeModal={toggleRenameRoomModal} updateName={updateName} currentName={room?.name}/>
              </Modal>
              <Modal show={showAddUserModal} onClose={toggleAddUserModal}>
                  <AddUserForm closeModal={toggleAddUserModal} updateUsers={updateUsers}/>
              </Modal>

          </div>
        )
    );
}