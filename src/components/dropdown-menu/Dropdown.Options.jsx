import React, { useEffect, useState } from 'react';
import './dropdown-menu.css'; 
import UserIcon from './../../assets/icons/users.svg?react';
import DeleteIcon from './../../assets/icons/delete.svg?react';
import { deleteUser } from '../../utils/api/requests';

import swal from 'sweetalert';

const DropdownOptions = ({ name, onClick1, onClick2, socket}) => {
    const [isOpen, setIsOpen] = useState(false);

    function toggleDropdown() {
        setIsOpen(!isOpen);
    }
    return (
        <div className="dropdown-menu reg">
            <button className="header-btn" onClick={toggleDropdown}>
                <span>{name}</span>
                <span className="arrow">{isOpen ? '▲' : '▼'}</span>
            </button>
            {isOpen && (
                <div className="dropdown-content reg">
                        <div className="dropdown-item" key={1} onClick={onClick1}>
                            {`+ ${name}`}
                        </div>
                        <div className="dropdown-item" key={2} onClick={onClick2}>
                            {`- ${name}`}
                        </div>
                </div>
            )}
        </div>
    );
};

export default DropdownOptions;