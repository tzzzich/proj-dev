import ProjectIcon from './../../assets/icons/project.svg?react'
import ProjectIconActive from './../../assets/icons/project-active.svg?react'
import { useNavigate } from 'react-router-dom';

export default function ProjectListItem ({project}) {
    const navigate = useNavigate();

    return(
        <div className="project-list-item" onClick={() => navigate(`${project.id}`)}>
            <div className="icon-holder">
                <ProjectIcon className="project"/>
                <ProjectIconActive className="project-active"/>
            </div>
            <h3>{project.name}</h3>
        </div>
    );
}