import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const Projects = () => {
    const [projects, setProjects] = useState([])

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}/auth/projects`)
            .then(result => {
                if (result.data.Status) {
                    setProjects(result.data.Result)
                } else {
                    alert(result.data.Error)
                }
            }).catch(err => console.log(err))
    }, [])

    return (
        <div className='px-5 mt-3'>
            <div className='d-flex justify-content-between align-items-center'>
                <h3>Project List</h3>
                <Link to="/dashboard/add_projects" className='btn btn-success'>Add Project</Link>
            </div>
            <div className='mt-3'>
                <table className='table table-bordered'>
                    <thead className="table-light">
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Status</th>
                            <th>Department</th>
                            <th>Manager</th>
                            <th>Client</th>
                            <th>Budget</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            projects.map(project => (
                                <tr key={project.project_id}>
                                    <td>{project.name}</td>
                                    <td>{project.description}</td>
                                    <td>{new Intl.DateTimeFormat('en-IN', {
                                        day: '2-digit',
                                        month: 'short',
                                        year: 'numeric'
                                    }).format(new Date(project.start_date))
                                    }</td>
                                    <td>{new Intl.DateTimeFormat('en-IN', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric'
                                        }).format(new Date(project.end_date))}</td>
                                    <td>{project.status}</td>
                                    <td>{project.dept_name || '—'}</td>
                                    <td>{project.manager_name || '—'}</td>
                                    <td>{project.client_name || '—'}</td>
                                    <td>₹{project.budget?.toLocaleString() || '—'}</td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Projects;
