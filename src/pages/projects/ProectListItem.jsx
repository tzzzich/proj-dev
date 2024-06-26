import ProjectIcon from './../../assets/icons/project.svg?react'
import ProjectIconActive from './../../assets/icons/project-active.svg?react'
import { Link, useNavigate} from 'react-router-dom';
import DeleteIcon from './../../assets/icons/delete.svg?react'
import { deleteRoom } from '../../utils/api/requests';

export default function ProjectListItem ({project, setRefetch}) {

    const navigate = useNavigate();

    function callAlert() {
        swal({
        title: "Are you sure?",
        text: "Are you sure you want to delete this room?",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      })
      .then((willDelete) => {
        if (willDelete) {
            deleteProject();
          swal("Successful deletion", {
            icon: "success",
          }
          );
        } else {
        }
      });
    };

    async function deleteProject () {
        try {
            const response = await deleteRoom(project._id) ;
            setRefetch();
        }
        catch (error) {
            swal("Error!", error, "error");
        }
    }

    return(
            <div className="project-list-item"  >
                    <div className="project-info" onClick={() => navigate(`/projects/${project._id}/table/${project.main_table}`)}>
                        <div className="icon-holder">
                            <ProjectIcon className="project"/>
                            <ProjectIconActive className="project-active"/>
                        </div>
                        <h3>{project.name}</h3>
                        
                    </div>
                <h2 className="delete-project" onClick={callAlert}><DeleteIcon/></h2>
            </div>
    );
}