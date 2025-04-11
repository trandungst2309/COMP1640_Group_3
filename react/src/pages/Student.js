import React, { useState, useEffect } from 'react';
import { Table, Form, Pagination, Button } from 'react-bootstrap';
import userService from '../services/userService';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import TrackPageView from '../components/TrackPageView';

function Student() {
    const [userStore] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : { name: 'Admin', role: 'guest' };
    });

    const [users, setUsers] = useState([]);
    const [tutors, setTutors] = useState([]);
    const [selectedTutors, setSelectedTutors] = useState({});
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [tutorColors, setTutorColors] = useState({});
    const [selectedTutor, setSelectedTutor] = useState("");
    const perPage = 5;

    // Fetch sinh viên và gia sư
    useEffect(() => {
        fetchUsers();
        fetchTutors();
    }, []);

    const fetchUsers = async () => {
        const res = await userService.getUsers('student');
        setUsers(res?.data || []);
    };

    const fetchTutors = async () => {
        const res = await userService.getTutor();
        setTutors(res?.data || []);
    };

    // Chọn hoặc bỏ chọn sinh viên
    const handleStudentSelect = (studentId) => {
        setSelectedStudents(prev =>
            prev.includes(studentId)
                ? prev.filter(id => id !== studentId)
                : [...prev, studentId]
        );
    };

    // Chọn tất cả sinh viên trên trang hiện tại
    const handleSelectAll = () => {
        const currentPageIds = paginatedUsers.map(user => user.id);
        const isAllSelected = currentPageIds.every(id => selectedStudents.includes(id));

        setSelectedStudents(isAllSelected
            ? selectedStudents.filter(id => !currentPageIds.includes(id))
            : [...new Set([...selectedStudents, ...currentPageIds])]
        );
    };

    // Gán gia sư cho sinh viên
    const handleTutorSelect = async (studentId, tutorId) => {
        try {
            setSelectedTutors(prev => ({ ...prev, [studentId]: tutorId }));
            setTutorColors(prev => ({ ...prev, [studentId]: tutorId !== "0" ? "#d1ecf1" : "white" }));

            await userService.updateUser({ userId: studentId, updateData: { parent_id: parseInt(tutorId) } });

            toast.success(tutorId === "0" ? "Remove Tutor assignment" : "Students have been assigned Tutors");

            fetchUsers(); // Cập nhật lại danh sách mà không cần reload trang
        } catch (error) {
            toast.error(error.message || "An error occurred while updating information.");
            console.error(error);
        }
    };

    // Gán gia sư hàng loạt
    const handleBulkAssignTutor = async () => {
        if (!selectedTutor) {
            toast.warning("Please select a Tutor");
            return;
        }

        try {
            await userService.bulkUser({ userId: selectedTutor, updateData: selectedStudents });

            toast.success("Students have been assigned Tutors");
            setSelectedStudents([]);

            fetchUsers(); // Cập nhật danh sách ngay thay vì reload trang
        } catch (error) {
            toast.error("An error occurred, please try again.");
            console.error(error);
        }
    };

    // Lọc sinh viên theo tên hoặc email
    const filteredUsers = users.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Phân trang sinh viên
    const paginatedUsers = filteredUsers.slice((currentPage - 1) * perPage, currentPage * perPage);
    const totalPages = Math.ceil(filteredUsers.length / perPage);

    return (
        <div className="container mt-4">
            <TrackPageView page="Student Management" />
            <ToastContainer autoClose={2000} />
            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
                {/* Thanh tìm kiếm */}
                <div className="d-flex align-items-center">
                    <h2 className="me-3"><i className="bi bi-people me-2"></i>Student Management</h2>
                    {
                        userStore?.role === 'staff' &&
                        <Form.Control
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="me-2"
                            style={{ maxWidth: '200px' }}
                        />
                    }
                </div>

                {/* Chọn gia sư hàng loạt */}
                {
                    userStore?.role === 'staff' &&
                    <div className="d-flex align-items-center">
                        <Form.Select
                            size="sm"
                            className="me-2"
                            onChange={(e) => setSelectedTutor(e.target.value)}
                            disabled={selectedStudents.length === 0}
                            style={{ minWidth: '100px' }}
                        >
                            <option value="">Choose a Tutor</option>
                            {tutors.map(t => (
                                <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                        </Form.Select>
                        <Button
                            variant="primary"
                            size="sm"
                            style={{ minWidth: '100px' }}
                            disabled={selectedStudents.length === 0}
                            onClick={() => handleBulkAssignTutor()}
                        >
                            Assign Tutor
                        </Button>
                    </div>
                }

            </div>

            {/* Bảng sinh viên */}
            <Table bordered hover responsive>
                <thead className="table-dark">
                    <tr>
                        {
                            userStore?.role === 'staff' &&
                            <th>
                                <Form.Check
                                    type="checkbox"
                                    checked={
                                        paginatedUsers.length > 0 &&
                                        paginatedUsers.every(user => selectedStudents.includes(user.id))
                                    }
                                    onChange={handleSelectAll}
                                />
                            </th>
                        }
                        <th>#</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Choose a Tutor</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedUsers.length ? paginatedUsers.map((user, index) => (
                        <tr key={user.id}>
                            {
                                userStore?.role === 'staff' &&
                                <td>
                                    <Form.Check
                                        type="checkbox"
                                        checked={selectedStudents.includes(user.id)}
                                        onChange={() => handleStudentSelect(user.id)}
                                    />
                                </td>
                            }
                            <td>{(currentPage - 1) * perPage + index + 1}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>
                                {userStore?.role === 'student' ? (
                                    tutors.find(t => t.id === user.parent_id)?.name || 'No tutor yet'
                                ) : (
                                    <Form.Select
                                        size="sm"
                                        value={selectedTutors[user.id] || user.parent_id || ''}
                                        onChange={(e) => handleTutorSelect(user.id, e.target.value)}
                                        style={{
                                            background: tutorColors[user.id] || (user.parent_id !== 0 ? '#d1ecf1' : 'white')
                                        }}
                                    >
                                        <option value="0">Choose a Tutor</option>
                                        {tutors.map(t => (
                                            <option key={t.id} value={t.id}>{t.name}</option>
                                        ))}
                                    </Form.Select>
                                )}
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan="6" className="text-center">No data found</td>
                        </tr>
                    )}
                </tbody>
            </Table>

            {/* Phân trang */}
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

export default Student;
