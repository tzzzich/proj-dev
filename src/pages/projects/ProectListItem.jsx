import ProjectIcon from './../../assets/icons/project.svg?react'
import ProjectIconActive from './../../assets/icons/project-active.svg?react'
import { Link, useNavigate} from 'react-router-dom';

export default function ProjectListItem ({project}) {

    const navigate = useNavigate();

    function deleteProject() {

    }

    return(
            <div className="project-list-item" onClick={() => navigate(`/projects/${project._id}/table/${project.main_table}`)} >
                    <div className="project-info">
                        <div className="icon-holder">
                            <ProjectIcon className="project"/>
                            <ProjectIconActive className="project-active"/>
                        </div>
                        <h3>{project.name}</h3>
                        
                    </div>
                <h2 className="delete-project" >Delete</h2>
            </div>
    );
}