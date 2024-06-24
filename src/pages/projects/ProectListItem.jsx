import ProjectIcon from './../../assets/icons/project.svg?react'
import ProjectIconActive from './../../assets/icons/project-active.svg?react'
import { Link} from 'react-router-dom';

export default function ProjectListItem ({project}) {
    return(
        <Link to={`${project._id}/table/${project.main_table}`}>
            <div className="project-list-item" >
                <div className="icon-holder">
                    <ProjectIcon className="project"/>
                    <ProjectIconActive className="project-active"/>
                </div>
                <h3>{project.name}</h3>
            </div>
        </Link>
    );
}