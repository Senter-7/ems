
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const Dept = () => {

    const [dept, setDept] = useState([])

    useEffect(()=> {
        axios.get(`${import.meta.env.VITE_API_URL}/auth/dept`)
        .then(result => {
            if(result.data.Status) {
                setDept(result.data.Result);
            } else {
                alert(result.data.Error)
            }
        }).catch(err => console.log(err))
    }, [])

    const formatBudget = (budget) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(budget || 0);
    };

  return (
    <div className='px-5 mt-3'>
        <div className='d-flex justify-content-center'>
            <h3>Department List</h3>
        </div>
        <Link to="/dashboard/add_dept" className='btn btn-success'>Add Department</Link>
        <div className='mt-3'>
            <table className='table'>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Members</th>
                        <th>Total Budget</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        dept.map(d => (
                            <tr key={d.id}>
                                <td>{d.name}</td>
                                <td>{d.member_count || 0}</td>
                                <td>{formatBudget(d.total_budget)}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>

    </div>
  )
}

export default Dept;
