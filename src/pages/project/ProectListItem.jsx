import ProjectIcon from './../../assets/icons/project.svg?react'
import ProjectIconActive from './../../assets/icons/project-active.svg?react'

export default function ProjectListItem ({project}) {
    return(
        <div className="project-list-item" onClick={() =>{console.log(project.id)}}>
            <div className="icon-holder">
                <ProjectIcon className="project"/>
                <ProjectIconActive className="project-active"/>
            </div>
            <h3>{project.name}</h3>
        </div>
    );
}