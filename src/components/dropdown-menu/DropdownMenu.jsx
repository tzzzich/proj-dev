import React, { useEffect, useState } from 'react';
import './dropdown-menu.css'; 
import UserIcon from './../../assets/icons/users.svg?react';
import DeleteIcon from './../../assets/icons/delete.svg?react';
import { deleteUser } from '../../utils/api/requests';

import swal from 'sweetalert';

const DropdownMenu = ({ items, socket, isAdmin}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [curItems, setCurItems] = useState(items);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        setCurItems(items);
    }, [items]);

    const removeUser = async (id) => {
        try {
            const response = await deleteUser(localStorage.getItem('roomId'), id );
            socket.emit("send-users")
            setCurItems( curItems.filter(item => item._id !== id));
        } catch (error) {
            swal("Error!", error, "error");
        }
    };

    return (
        <div className="dropdown-menu">
            <button className="header-btn users" onClick={toggleDropdown}>
                <UserIcon className="users-icon" />
                <span>Users</span>
                <span className="arrow">{isOpen ? '▲' : '▼'}</span>
            </button>
            {isOpen && (
                <div className="dropdown-content">
                    { curItems? curItems.map(item => (
                        <div className="dropdown-item" key={item._id}>
                            {item.username}
                            {isAdmin && <DeleteIcon
                                className="delete-icon"
                                onClick={() => removeUser(item._id)}
                            />}
                        </div>
                    )) : null}
                </div>
            )}
        </div>
    );
};

export default DropdownMenu;

