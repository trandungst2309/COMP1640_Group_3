import React, { useState, useEffect, useRef } from 'react';
import { Table, Button, Form, Pagination, Modal } from 'react-bootstrap';
import { FaEdit, FaTrashAlt, FaPlus, FaRecordVinyl } from 'react-icons/fa';
import { Link } from "react-router-dom";
import meetingService from '../services/meetingService';
import { toast, ToastContainer } from 'react-toastify';
import TrackPageView from '../components/TrackPageView';

const paginate = (items, currentPage, perPage) => {
    const startIndex = (currentPage - 1) * perPage;
    return items.slice(startIndex, startIndex + perPage);
};

function Meeting() {
    const [meetings, setMeetings] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [showRecordingModal, setShowRecordingModal] = useState(false);
    const perPage = 5;
    const [recordings, setRecordings] = useState([]);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const audioChunks = useRef([]);

    const [user] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : { name: 'Admin', role: 'guest' };
    });

    useEffect(() => {
        const fetchMeetings = async () => {
            const data = await meetingService.getMeetings();
            setMeetings(data?.data?.data);
        };
        fetchMeetings();
    }, []);

    const filteredMeetings = Array.isArray(meetings) ? meetings.filter(meeting =>
        meeting.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meeting.type?.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    const paginatedMeetings = paginate(filteredMeetings, currentPage, perPage);
    const totalPages = Math.ceil(filteredMeetings.length / perPage);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this meeting?');
        if (!confirmDelete) return;

        try {
            await meetingService.deleteMeeting(id);
            toast.success('Meeting deleted successfully!', { position: 'top-center', autoClose: 2000 });
            setMeetings(meetings.filter(meeting => meeting.id !== id));
        } catch (error) {
            toast.error(error || 'Delete failed meeting!', { position: 'top-center', autoClose: 2000 });
        }
    };

    const handleStatusChange = async (meetingId, newStatus) => {
        try {
            // Update the status on the server
            await meetingService.updateMeeting(meetingId, {status: newStatus});
            // Update the status locally
            setMeetings(prevMeetings =>
                prevMeetings.map(meeting =>
                    meeting.id === meetingId ? { ...meeting, status: newStatus } : meeting
                )
            );
            toast.success('Status update successful!', { position: 'top-center', autoClose: 2000 });
        } catch (error) {
            toast.error('Update status failed!', { position: 'top-center', autoClose: 2000 });
        }
    };

    const statusOptions = [
        { value: 'pending', label: 'Pending' },
        { value: 'confirmed', label: 'Confirmed' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' },
    ];

    const handleRecordClick = () => {
        setShowRecordingModal(true);
    };

    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        recorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                audioChunks.current.push(event.data);
            }
        };
        recorder.onstop = () => {
            const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });
            const audioUrl = URL.createObjectURL(audioBlob);
            setRecordings((prev) => [...prev, { url: audioUrl, blob: audioBlob }]);
            audioChunks.current = [];
        };
        recorder.start();
        setMediaRecorder(recorder);
        setIsRecording(true);
    };

    const stopRecording = () => {
        if (mediaRecorder) {
            mediaRecorder.stop();
            setIsRecording(false);
        }
    };

    return (
        <div className="container mt-4">
            <TrackPageView page="Meeting Management" />
            <ToastContainer />
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2><i className="bi bi-camera-video me-2"></i>Meeting Management</h2>
                <div className="d-flex">
                    <Form.Control
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="me-2"
                        style={{ maxWidth: '250px' }}
                    />
                    <Link to="/meeting/insert">
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
                        <th>Meeting Type</th>
                        <th>Tutor</th>
                        <th>Student</th>
                        <th>Start date</th>
                        <th>End date</th>
                        <th style={{ width: '150px' }}>Status</th>
                        <th style={{ width: '250px' }}>Function</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedMeetings.length > 0 ? (
                        paginatedMeetings.map((meeting, index) => (
                            <tr key={meeting.id}>
                                <td>{(currentPage - 1) * perPage + index + 1}</td>
                                <td>{meeting.name}</td>
                                <td>{meeting.type}</td>
                                <td>
                                    {meeting.tutors && meeting.tutors.length > 0
                                        ? meeting.tutors.map(tutor => tutor.name).join(', ')
                                        : 'N/A'}
                                </td>
                                <td>
                                    {meeting.students && meeting.students.length > 0
                                        ? meeting.students.map(student => student.name).join(', ')
                                        : 'N/A'}
                                </td>
                                <td>{meeting.start_time}</td>
                                <td>{meeting.end_time}</td>
                                <td>
                                    <Form.Select
                                        size="sm"
                                        defaultValue={meeting.status}
                                        onChange={(e) => handleStatusChange(meeting.id, e.target.value)}
                                    >
                                        {statusOptions.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </td>
                                <td>
                                    <Link to={'/meeting/update/' + meeting.id}>
                                        <Button
                                            variant="warning"
                                            size="sm"
                                            className="me-2"
                                        >
                                            <FaEdit /> Edit
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="info"
                                        size="sm"
                                        className="me-2"
                                        onClick={handleRecordClick}
                                    >
                                        <FaRecordVinyl /> Record
                                    </Button>
                                    {(user.role !== "student" && user.role !== "tutor") && (
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => handleDelete(meeting.id)}
                                    >
                                        <FaTrashAlt /> Delete
                                    </Button>
                                    )}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="text-center">
                                No data
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
            <Modal show={showRecordingModal} onHide={() => setShowRecordingModal(false)} size="lg" centered>
                <Modal.Header closeButton className="bg-light">
                    <Modal.Title className="fs-5 fw-semibold text-dark">🎙️ Record</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    <div className="d-flex flex-column align-items-center">
                        <button
                            onClick={isRecording ? stopRecording : startRecording}
                            className={`btn rounded-circle shadow-lg d-flex align-items-center justify-content-center fw-semibold fs-5 
                    ${isRecording ? "btn-danger animate-pulse" : "btn-primary"}`}
                            style={{ width: "120px", height: "120px" }}
                        >
                            {isRecording ? "🛑 Stop" : "🎤 Start"}
                        </button>

                        {recordings.length > 0 && (
                            <div className="mt-4 w-100">
                                <h3 className="fs-6 fw-semibold text-secondary mb-3">📂 Recording list:</h3>
                                <div className="row g-3">
                                    {recordings.map((rec, index) => (
                                        <div key={index} className="col-12 col-md-6">
                                            <div className="p-3 bg-light rounded shadow-sm d-flex flex-column align-items-center">
                                                <span className="text-muted fw-medium">📌 {index + 1}</span>
                                                <audio controls src={rec.url} className="w-100 mt-2"></audio>
                                                <a
                                                    href={rec.url}
                                                    download={`recording-${index + 1}.webm`}
                                                    className="btn btn-success mt-3"
                                                >
                                                    ⬇️ Dowload
                                                </a>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default Meeting;
