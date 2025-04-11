import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Row, Col } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MultiSelect } from 'react-multi-select-component';
import { useParams } from 'react-router-dom';
import meetingService from '../../services/meetingService';
import userService from '../../services/userService';

function MeetingUpdate() {
    const { id } = useParams();

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
        status: '',
    });

    const [studentOptions, setStudentOptions] = useState([]);
    const [tutorOptions, setTutorOptions] = useState([]);

    useEffect(() => {
        const fetchMeetingDetails = async () => {
            try {
                const meeting = await meetingService.getMeetingById(id);
                const data = meeting.data;

                setFormData({
                    name: data.name,
                    type: data.type,
                    start_time: data.start_time,
                    end_time: data.end_time,
                    students: data.students.map(student => student.id),
                    tutors: data.tutors.map(tutor => tutor.id),
                    status: data.status,
                });
            } catch (error) {
                toast.error('Unable to get meeting details.', {
                    position: 'top-center',
                    autoClose: 2000,
                });
            }
        };

        const fetchUsers = async () => {
            try {
                const [students, tutors] = await Promise.all([
                    userService.getStudent(),
                    userService.getUsers('tutor'),
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
                toast.error('Unable to get user list.', {
                    position: 'top-center',
                    autoClose: 2000,
                });
            }
        };

        fetchMeetingDetails();
        fetchUsers();
    }, [id]);

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
            toast.error('The start time cannot be in the past.', {
                position: 'top-center',
                autoClose: 2000,
            });
            return;
        }

        if (endTime <= startTime) {
            toast.error('The end time must be after the start time.', {
                position: 'top-center',
                autoClose: 2000,
            });
            return;
        }

        try {
            await meetingService.updateMeeting(id, { ...formData });
            
            toast.success('Meeting update successful!', {
                position: 'top-center',
                autoClose: 2000,
            });
        } catch (error) {
            toast.error('Meeting update fail!', {
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
                    <h4>Meeting Update</h4>
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
                                value={studentOptions.filter(option => formData.students.includes(option.value))}
                                onChange={(selected) => handleMultiSelectChange(selected, 'students')}
                                labelledBy="Select student"
                            />
                        </Form.Group>
                        {(user.role === "admin") && (
                        <Form.Group className="mb-4">
                            <Form.Label>Choose a tutor <span className='text-danger'>(*)</span></Form.Label>
                            <MultiSelect
                                options={tutorOptions}
                                value={tutorOptions.filter(option => formData.tutors.includes(option.value))}
                                onChange={(selected) => handleMultiSelectChange(selected, 'tutors')}
                                labelledBy="Choose a tutor"
                            />
                        </Form.Group>
                         )}
                        <Button type="submit" variant="primary" className="w-100">
                            Update meeting
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
}

export default MeetingUpdate;
