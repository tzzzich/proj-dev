import { useEffect, useState } from "react";
import { getRooms } from "../../utils/api/requests";
import ProjectListItem from "./ProectListItem";


export default function ProjectHolder () {

    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);

    const [refetchRooms, setRefetchRooms] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
          try {
            setLoading(true);
            const response = await getRooms();
            console.log(response);
            setProjects(response.my_rooms);
            setLoading(false);
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
    
        fetchData();
      }, [refetchRooms]);

      function setRefetch() {
        setRefetchRooms(prev => !prev);
      }

    return (
      <div className="project-holder">
        {loading ? <h2>Loading...</h2> :
          <>
            <h2>Open Project</h2>
            <div className="project-list">
                {
                  projects ?
                    projects.map(project =>
                        <ProjectListItem project={project} key={project._id} setRefetch={setRefetch}/>
                    )
                    :
                    'You don\'t have any projects yet'
                }
            </div>
          </>
        }
      </div>
    );
}