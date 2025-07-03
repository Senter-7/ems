import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AddProject = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        start_date: '',
        end_date: '',
        dept_id: '',
        manager_id: '',
        budget: '',
        client_name: '',
        status: 'Not Started'
    });

    const [departments, setDepartments] = useState([]);
    const [managers, setManagers] = useState([]);

    useEffect(() => {
        // Fetch departments
        axios.get(`${import.meta.env.VITE_API_URL}/auth/dept`)
            .then(result => {
                if (result.data.Status) {
                    setDepartments(result.data.Result);
                } else {
                    alert(result.data.Error);
                }
            }).catch(err => console.log(err));

        // Fetch managers (assuming employees endpoint returns only managers or all with filtering)
        axios.get(`${import.meta.env.VITE_API_URL}/auth/employee`)
            .then(result => {
                if (result.data.Status) {
                    setManagers(result.data.Result);
                } else {
                    alert(result.data.Error);
                }
            }).catch(err => console.log(err));
    }, []);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post(`${import.meta.env.VITE_API_URL}/auth/addprojects`, formData)
            .then(result => {
                if (result.data.Status) {
                    alert("Project created successfully!");
                    navigate('/dashboard/projects');
                } else {
                    alert(result.data.Error);
                }
            }).catch(err => console.log(err));
    };

    return (
        <div className='px-5 mt-3'>
            <h3>Add New Project</h3>
            <form onSubmit={handleSubmit}>
                <div className='mb-3'>
                    <label className='form-label'>Project Name</label>
                    <input type='text' className='form-control' name='name' onChange={handleChange} required />
                </div>

                <div className='mb-3'>
                    <label className='form-label'>Description</label>
                    <textarea className='form-control' name='description' onChange={handleChange} required />
                </div>

                <div className='mb-3'>
                    <label className='form-label'>Start Date</label>
                    <input type='date' className='form-control' name='start_date' onChange={handleChange} required />
                </div>

                <div className='mb-3'>
                    <label className='form-label'>End Date</label>
                    <input type='date' className='form-control' name='end_date' onChange={handleChange} required />
                </div>

                <div className='mb-3'>
                    <label className='form-label'>Department</label>
                    <select className='form-control' name='dept_id' onChange={handleChange} required>
                        <option value=''>Select Department</option>
                        {departments.map(dept => (
                            <option key={dept.id} value={dept.id}>{dept.name}</option>
                        ))}
                    </select>
                </div>

                <div className='mb-3'>
                    <label className='form-label'>Project Manager</label>
                    <select className='form-control' name='manager_id' onChange={handleChange} required>
                        <option value=''>Select Manager</option>
                        {managers.map(manager => (
                            <option key={manager.id} value={manager.id}>{manager.name}</option>
                        ))}
                    </select>
                </div>

                <div className='mb-3'>
                    <label className='form-label'>Budget (₹)</label>
                    <input type='number' className='form-control' name='budget' onChange={handleChange} />
                </div>

                <div className='mb-3'>
                    <label className='form-label'>Client Name</label>
                    <input type='text' className='form-control' name='client_name' onChange={handleChange} />
                </div>

                <div className='mb-3'>
                    <label className='form-label'>Status</label>
                    <select className='form-control' name='status' onChange={handleChange}>
                        <option value="Not Started">Not Started</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="On Hold">On Hold</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>

                <button className='btn btn-primary' type='submit'>Create Project</button>
            </form>
        </div>
    );
};

export default AddProject;
