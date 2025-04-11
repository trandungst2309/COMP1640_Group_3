import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Pagination } from 'react-bootstrap';
import { FaEdit, FaTrashAlt, FaPlus } from 'react-icons/fa';
import { Link } from "react-router-dom";
import userService from '../services/userService';
import { toast } from 'react-toastify';
import TrackPageView from '../components/TrackPageView';

const paginate = (items, currentPage, perPage) => {
    const startIndex = (currentPage - 1) * perPage;
    return items.slice(startIndex, startIndex + perPage);
};

function User() {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const perPage = 5;

    useEffect(() => {
        const fetchUsers = async () => {
            const data = await userService.getUsers();
            setUsers(data?.data);
        };
        fetchUsers();
    }, []);

    const filteredUsers = Array.isArray(users) ? users.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    const paginatedUsers = paginate(filteredUsers, currentPage, perPage);
    const totalPages = Math.ceil(filteredUsers.length / perPage);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this user??');
        if (!confirmDelete) return;
    
        try {
            await userService.deleteUser(id);
            toast.success('User deleted successfully!', { position: 'top-center', autoClose: 2000 });
            setUsers(users.filter(user => user.id !== id));
        } catch (error) {
            toast.error(error || 'Delete user failed!', { position: 'top-center', autoClose: 2000 });
        }
    };

    return (
        <div className="container mt-4">
            <TrackPageView page="User Management" />
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2><i className="bi bi-people me-2"></i>User Management</h2>
                <div className="d-flex">
                    <Form.Control
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="me-2"
                        style={{ maxWidth: '250px' }}
                    />
                    <Link to="/user/insert">
                        <Button variant="primary" style={{ display: 'flex', alignItems: 'center' }}>
                            <FaPlus className="me-2" /> Add
                        </Button>
                    </Link>
                </div>
            </div>
            <Table bordered hover responsive>
                <thead className="table-dark">
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th style={{ width: '300px' }}>Function</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedUsers.length > 0 ? (
                        paginatedUsers.map((user, index) => (
                            <tr key={user.id}>
                                <td>{(currentPage - 1) * perPage + index + 1}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>
                                    <Link to={'/user/update/' + user.id}>
                                        <Button
                                            variant="warning"
                                            size="sm"
                                            className="me-2"
                                        >
                                            <FaEdit /> Edit
                                        </Button>
                                    </Link>
                                    <Link to={'/user/change-password/' + user.id}>
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            className="me-2"
                                        >
                                            <FaEdit /> Change password
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => handleDelete(user.id)}
                                    >
                                        <FaTrashAlt /> Delete
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" className="text-center">
                                No data found
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
            {totalPages > 1 && (
                <Pagination className="justify-content-end">
                    <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
                    <Pagination.Prev onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} />

                    {[...Array(totalPages)].map((_, i) => (
                        <Pagination.Item
                            key={i + 1}
                            active={i + 1 === currentPage}
                            onClick={() => setCurrentPage(i + 1)}
                        >
                            {i + 1}
                        </Pagination.Item>
                    ))}

                    <Pagination.Next onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} />
                    <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
                </Pagination>
            )}
        </div>
    );
}

export default User;
