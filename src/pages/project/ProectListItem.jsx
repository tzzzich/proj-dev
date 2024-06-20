export default function ProjectListItem ({project}) {
    return(
        <div className="project-list-item" onClick={() =>{console.log(project.id)}}>
            <h3>{project.name}</h3>
        </div>
    );
}