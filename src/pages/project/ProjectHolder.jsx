import { useEffect, useState } from "react";
import { getProjects } from "../../utils/api";
import ProjectListItem from "./ProectListItem";



export default function ProjectHolder () {

    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await getProjects();
            setProjects(response.data);
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
    
        fetchData();
      }, []);

    return (

            <div className="project-holder">
                <h2>Open Project</h2>
                <div className="project-list">
                    {
                        projects.map(project =>
                            <ProjectListItem project={project} key={project.id}/>
                        )
                    }
                </div>
            </div>
    );
}