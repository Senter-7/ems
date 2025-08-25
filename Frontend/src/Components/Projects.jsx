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
        <div className='px-6 py-4'>
            <div className='flex justify-between items-center mb-6'>
                <h3 className='text-2xl font-semibold text-gray-800'>Project List</h3>
                <Link to="/dashboard/add_projects" className='bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow'>
                    Add Project
                </Link>
            </div>
            <div className='mt-3'>
                <table className='table table-bordered'>
                    <thead className="table-light">
                        <tr>
                            <th className='px-4 py-3 text-left font-medium'>Name</th>
                            <th className='px-4 py-3 text-left font-medium'>Description</th>
                            <th className='px-4 py-3 text-left font-medium'>Start Date</th>
                            <th className='px-4 py-3 text-left font-medium'>End Date</th>
                            <th className='px-4 py-3 text-left font-medium'>Status</th>
                            <th className='px-4 py-3 text-left font-medium'>Department</th>
                            <th className='px-4 py-3 text-left font-medium'>Manager</th>
                            <th className='px-4 py-3 text-left font-medium'>Client</th>
                            <th className='px-4 py-3 text-left font-medium'>Budget</th>
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
