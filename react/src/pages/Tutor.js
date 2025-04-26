import React, { useState, useEffect } from 'react';
import { Table, Form, Pagination, Button, Modal } from 'react-bootstrap';
import userService from '../services/userService';
import TrackPageView from '../components/TrackPageView';

const paginate = (items, currentPage, perPage) => {
    const startIndex = (currentPage - 1) * perPage;
    return items.slice(startIndex, startIndex + perPage);
};

function Tutor() {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const perPage = 5;

    // State to manage modal
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [students, setStudents] = useState([]);
    
    useEffect(() => {
        const fetchUsers = async () => {
            const data = await userService.getTutor();
            setUsers(data?.data || []);
        };
        fetchUsers();
    }, []);

    const fetchStudents = async (tutorId) => {
        const data = await userService.getTutor('student', tutorId);
        setStudents(data?.data || []);
    };

    const handleShowDetails = async (user) => {
        setSelectedUser(user);
        setShowModal(true);
        await fetchStudents(user.id);
    };

    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const paginatedUsers = paginate(filteredUsers, currentPage, perPage);
    const totalPages = Math.ceil(filteredUsers.length / perPage);

    return (
        <div className="container mt-4">
            <TrackPageView page="Tutor Management" />
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2><i className="bi bi-people me-2"></i>Tutor Management</h2>
                <Form.Control
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ maxWidth: '250px' }}
                />
            </div>

            {/* Table Tutor */}
            <Table bordered hover responsive>
                <thead className="table-dark">
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Function</th>
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
                                    <Button variant="info" size="sm" onClick={() => handleShowDetails(user)}>
                                        View
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center">
                                No data found
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>

            {/* Pagination */}
            {totalPages > 1 && (
                <Pagination className="justify-content-end">
                    <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
                    <Pagination.Prev onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} />
                    {[...Array(totalPages)].map((_, i) => (
                        <Pagination.Item key={i + 1} active={i + 1 === currentPage} onClick={() => setCurrentPage(i + 1)}>
                            {i + 1}
                        </Pagination.Item>
                    ))}
                    <Pagination.Next onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} />
                    <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
                </Pagination>
            )}

            {/* Modal displays tutor details and student list*/}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Tutor Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedUser ? (
                        <>
                            <div className="mb-4">
                                <p><strong>Name:</strong> {selectedUser.name}</p>
                                <p><strong>Email:</strong> {selectedUser.email}</p>
                                <p><strong>Role:</strong> {selectedUser.role}</p>
                            </div>
                            <h5>List of Students</h5>
                            <Table bordered hover responsive>
                                <thead className="table-secondary">
                                    <tr>
                                        <th>#</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.length > 0 ? (
                                        students.map((student, index) => (
                                            <tr key={student.id}>
                                                <td>{index + 1}</td>
                                                <td>{student.name}</td>
                                                <td>{student.email}</td>
                                                <td>{student.role}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" className="text-center">
                                                No students
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </>
                    ) : (
                        <p>No data available</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default Tutor;
