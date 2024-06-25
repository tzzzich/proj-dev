import React, { useState } from 'react';
import './dropdown-menu.css'; 
import UserIcon from './../../assets/icons/users.svg?react';
import DeleteIcon from './../../assets/icons/delete.svg?react';
import { deleteUser } from '../../utils/api/requests';

const DropdownMenu = ({ items }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [curItems, setCurItems] = useState(items);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const removeUser = async (id) => {
        try {
            const response = await deleteUser(localStorage.getItem('roomId'), id );
            const newItems = curItems.filter(item => item._id !== id);
            setCurItems(newItems);
        } catch (error) {
            console.log(error);
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
                    {curItems.map(item => (
                        <div className="dropdown-item" key={item._id}>
                            {item.username}
                            <DeleteIcon
                                className="delete-icon"
                                onClick={() => removeUser(item._id)}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DropdownMenu;

