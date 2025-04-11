import React, { useState, useEffect } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import userService from '../../services/userService';
import { useParams } from 'react-router-dom';

function UserUpdate() {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'staff',
    });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await userService.getUserById(id);
                setFormData({
                    name: user?.data.name,
                    email: user?.data.email,
                    role: user?.data.role || 'staff',
                });
            } catch (error) {
                toast.error('Unable to load user data.');
            }
        };
        fetchUser();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userId = id;
            const updateData = {
                name: formData.name,
                email: formData.email,
                role: formData.role,
            };

            await userService.updateUser({
                userId,
                updateData,
            });
            
            toast.success('Membership update successful!');
        } catch (error) {
            toast.error('Member update failed!');
        }
    };

    return (
        <div className="container mt-4">
            <ToastContainer />
            <Card className="shadow">
                <Card.Header><h4>Member Update</h4></Card.Header>
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Fullname</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter Fullname"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter email"
                            />
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label>Role</Form.Label>
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
                            Update members
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
}

export default UserUpdate;
