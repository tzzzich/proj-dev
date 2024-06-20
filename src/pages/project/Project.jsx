import ProjectHolder from "./ProjectHolder";

import './project-page.css'
import Modal from "../../components/ui/modal/Modal";
import { useState } from "react";
import JoinForm from "./JoinForm";
import CreateForm from "./CreateForm";

export default function Project () {

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