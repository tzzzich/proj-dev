import ProjectHolder from "./ProjectHolder";

import './project-page.css'
import Modal from "../../components/ui/modal/Modal";
import { useEffect, useState } from "react";
import JoinForm from "./JoinForm";
import CreateForm from "./CreateForm";
import { useNavigate } from "react-router-dom";

export default function ProjectsPage () {
    const navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token || token === 'null') {
            navigate('/login');
        }
    }, [navigate]);

    const[showJoinModal, setShowJoinModal] = useState(false);

    function toggleJoinModal() {
        setShowJoinModal(!showJoinModal);
    }

    const[showCreateModal, setShowCreateModal] = useState(false);

    function toggleCreateModal() {
        setShowCreateModal(!showCreateModal);
    }

    return (
        <div className="content-wrapper">
            <div className="selections">
                <button onClick={() => toggleJoinModal()}>Join project</button>
                <button onClick={() => toggleCreateModal()}>Create project</button>
            </div>
            <ProjectHolder/>

            <Modal title={'title'} show={showJoinModal} onClose={toggleJoinModal}>
                <JoinForm closeModal={toggleJoinModal}/>
            </Modal>
            <Modal title={'title'} show={showCreateModal} onClose={toggleCreateModal}>
                <CreateForm closeModal={toggleCreateModal}/>
            </Modal>
        </div>
    );
}