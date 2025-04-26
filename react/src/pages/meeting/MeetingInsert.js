import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Row, Col } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MultiSelect } from 'react-multi-select-component';
import meetingService from '../../services/meetingService';
import userService from '../../services/userService';

function MeetingInsert() {
    const [user] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : { name: 'Admin', role: 'guest' };
    });

    const [formData, setFormData] = useState({
        name: '',
        type: '',
        start_time: '',
        end_time: '',
        students: [],
        tutors: user.role === "tutor" ? [user.id] : [],
    });
    
    const [studentOptions, setStudentOptions] = useState([]);
    const [tutorOptions, setTutorOptions] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const [students, tutors] = await Promise.all([
                    userService.getStudent(),
                    userService.getTutor('tutor'),
                ]);
                
                setStudentOptions(students.data.map(student => ({
                    label: student.name,
                    value: student.id,
                })));

                setTutorOptions(tutors.data.map(tutor => ({
                    label: tutor.name,
                    value: tutor.id,
                })));
            } catch (error) {
                toast.error('Failed to fetch users', {
                    position: 'top-center',
                    autoClose: 2000,
                });
            }
        };

        fetchUsers();
    }, []);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleMultiSelectChange = (selected, field) => {
        const selectedValues = selected ? selected.map(option => option.value) : [];
        setFormData(prevFormData => ({ ...prevFormData, [field]: selectedValues }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        const currentTime = new Date();
        const startTime = new Date(formData.start_time);
        const endTime = new Date(formData.end_time);

        if (startTime < currentTime) {
            toast.error('The starting time cannot be in the past.', {
                position: 'top-center',
                autoClose: 2000,
            });
            return;
        }

        if (endTime <= startTime) {
            toast.error('The end time must be greater than the start time.', {
                position: 'top-center',
                autoClose: 2000,
            });
            return;
        }

        try {
            await meetingService.createMeeting({ ...formData });

            toast.success('Meeting has been added successfully!', {
                position: 'top-center',
                autoClose: 2000,
            });

            setFormData({
                name: '',
                type: '',
                start_time: '',
                end_time: '',
                students: [],
                tutors: [],
            });
        } catch (error) {
            toast.error('Failed to add meeting', {
                position: 'top-center',
                autoClose: 2000,
            });
        }
    };

    return (
        <div className="container mt-4">
            <ToastContainer />
            <Card className="shadow">
                <Card.Header>
                    <h4>Add Meeting</h4>
                </Card.Header>
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Meeting Name <span className='text-danger'>(*)</span></Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter meeting name"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Meeting Type <span className='text-danger'>(*)</span></Form.Label>
                            <Form.Control
                                type="text"
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                placeholder="Enter meeting type"
                                required
                            />
                        </Form.Group>

                        <Row>
                            <Col>
                                <Form.Group className="mb-3">
                                    <Form.Label>Start time <span className='text-danger'>(*)</span></Form.Label>
                                    <Form.Control
                                        type="datetime-local"
                                        name="start_time"
                                        value={formData.start_time}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3">
                                    <Form.Label>End time <span className='text-danger'>(*)</span></Form.Label>
                                    <Form.Control
                                        type="datetime-local"
                                        name="end_time"
                                        value={formData.end_time}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3">
                            <Form.Label>Select student <span className='text-danger'>(*)</span></Form.Label>
                            <MultiSelect
                                options={studentOptions}
                                value={formData.students.map(id => studentOptions.find(option => option.value === id))}
                                onChange={(selected) => handleMultiSelectChange(selected, 'students')}
                                labelledBy="Select student"
                                overrideStrings={{
                                    selectSomeItems: "Select student",
                                    allItemsAreSelected: "All students have been selected",
                                    selectAll: "Select all",
                                    search: "Search",
                                }}
                            />

                        </Form.Group>
                        
                        {(user.role === "admin") && (
                        <Form.Group className="mb-4">
                            <Form.Label>Choose a tutor <span className='text-danger'>(*)</span></Form.Label>
                            <MultiSelect
                                options={tutorOptions}
                                value={formData.tutors.map(id => tutorOptions.find(option => option.value === id))}
                                onChange={(selected) => handleMultiSelectChange(selected, 'tutors')}
                                labelledBy="Choose a tutor"
                                overrideStrings={{
                                    selectSomeItems: "Choose a tutor",
                                    allItemsAreSelected: "All tutors have been selected",
                                    selectAll: "Select all",
                                    search: "Search",
                                }}
                            />
                        </Form.Group>
                        )}

                        <Button type="submit" variant="primary" className="w-100">
                            ADD
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
}

export default MeetingInsert;
