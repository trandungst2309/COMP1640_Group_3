import React, { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import userService from '../../services/userService';
import { useParams } from 'react-router-dom';

function PasswordUpdate() {
    const { id } = useParams();
    const [passwords, setPasswords] = useState({
        newPassword: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPasswords({ ...passwords, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            toast.error('Confirmation password does not match!');
            return;
        }

        try {
            const userId = id;
            const updateData = {
                password: passwords.newPassword
            };

            await userService.updateUser({
                userId,
                updateData,
            });
            toast.success('Password changed successfully!');
            setPasswords({ newPassword: '', confirmPassword: '' });
        } catch (error) {
            toast.error('Password change failed!');
        }
    };

    return (
        <div className="container mt-4">
            <ToastContainer />
            <Card className="shadow">
                <Card.Header><h4>Change password</h4></Card.Header>
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>New password</Form.Label>
                            <Form.Control
                                type="password"
                                name="newPassword"
                                value={passwords.newPassword}
                                onChange={handleChange}
                                placeholder="Enter new password"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label>Confirm password</Form.Label>
                            <Form.Control
                                type="password"
                                name="confirmPassword"
                                value={passwords.confirmPassword}
                                onChange={handleChange}
                                placeholder="Enter re-password"
                                required
                            />
                        </Form.Group>

                        <Button type="submit" variant="primary" className="w-100">
                            Change Password
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
}

export default PasswordUpdate;