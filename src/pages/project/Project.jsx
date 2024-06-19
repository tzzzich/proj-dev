import ProjectHolder from "./ProjectHolder";

import './project-page.css'

export default function Project () {
    return (
        <div className="content-wrapper">
            <div className="selections">
                <button>Join project</button>
                <button>Create project</button>
            </div>
            <ProjectHolder/>
        </div>
    );
}