import React, { useState } from 'react';
import './dropdown-menu.css'; 
import UserIcon from './../../assets/icons/users.svg?react'
import DeleteIcon from './../../assets/icons/delete.svg?react'

const DropdownMenu = ({items}) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="dropdown-menu">
            <button className="header-btn users" onClick={toggleDropdown}>
                <UserIcon className="users-icon"/>
                <span>Users</span>
                <span className="arrow">{isOpen ? '▲' : '▼'}</span>
            </button>
            {isOpen && (
                <div className="dropdown-content">
                    {items.map(item => 
                        <div className="dropdown-item" key={item._id}>
                            {item.username} 
                            <DeleteIcon className="delete-icon"/>
                        </div>
                    )}
                </div>
            )}
        </div>
        
    );
};

export default DropdownMenu;
