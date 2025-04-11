import React, { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import userService from '../../services/userService';

function UserInsert() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'staff',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Kiểm tra mật khẩu
        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match!', {
                position: 'top-center',
                autoClose: 2000,
            });
            return;
        }

        try {
            await userService.createUser({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: formData.role,
            });

            toast.success('User added successfully!', {
                position: 'top-center',
                autoClose: 2000,
            });

            setFormData({
                name: '',
                email: '',
                password: '',
                confirmPassword: '',
                role: 'staff',
            });
        } catch (error) {
            if (error.errors) {
                const errorMessages = Object.values(error.errors).flat().join(', ');
                toast.error(errorMessages || 'Add user failed!', {
                    position: 'top-center',
                    autoClose: 2000,
                });
            } else {
                toast.error(error.message || 'Add user failed!', {
                    position: 'top-center',
                    autoClose: 2000,
                });
            }
        }
    };

    return (
        <div className="container mt-4">
            <ToastContainer />
            <Card className="shadow">
                <Card.Header>
                    <h4>Add user</h4>
                </Card.Header>
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Fullname <span className='text-danger'>(*)</span></Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter fullname"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Email <span className='text-danger'>(*)</span></Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter email"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Password <span className='text-danger'>(*)</span></Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter password"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Confirm password <span className='text-danger'>(*)</span></Form.Label>
                            <Form.Control
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Enter re-password"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label>Role <span className='text-danger'>(*)</span></Form.Label>
                            <Form.Select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                            >
                                <option value="staff">Staff</option>
                                <option value="tutor">Tutor</option>
                                <option value="student">Student</option>
                            </Form.Select>
                        </Form.Group>

                        <Button type="submit" variant="primary" className="w-100">
                            Insert user
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
}

export default UserInsert;
