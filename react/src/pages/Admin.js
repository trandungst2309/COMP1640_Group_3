import { useState, useEffect } from 'react';
import { Outlet, Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Chat from "../components/Chat";
import logService from "../services/notiService";

function Admin() {
    const [user] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : { name: 'Admin', role: 'guest' };
    });

    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await logService.getLogs();

                if (response?.data && Array.isArray(response.data)) {
                    const updatedNotifications = response.data.map(notification => ({
                        message: `${notification.table.toUpperCase()} ${notification.action.toUpperCase()} - ${notification.time}`,
                        detail: notification.message,
                    }));

                    setNotifications(updatedNotifications);
                }
            } catch (error) {
                console.error('Error fetching logs:', error);
            }
        };

        const intervalId = setInterval(fetchData, 1000);

        return () => clearInterval(intervalId);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    return (
        <div className="d-flex">
            <div className="bg-dark text-white p-3 shadow" style={{ width: '250px', minHeight: '100vh' }}>
                <h4 className="mb-4 text-center">🌟 eTutoring </h4>
                <ul className="nav flex-column">
                    <li className="nav-item mb-3">
                        <Link to="/" className="nav-link custom-hover d-flex align-items-center text-white">
                            <i className="bi bi-speedometer2 me-2"></i> Dashboard
                        </Link>
                    </li>
                    <li className="nav-item mb-3">
                        <Link to="/forum" className="nav-link custom-hover d-flex align-items-center text-white">
                            <i className="bi bi-people-fill me-2"></i> Join Forum
                        </Link>
                    </li>
                    {(user.role === "tutor" || user.role === "staff" || user.role === "admin") && (
                        <li className="nav-item mb-3">
                            <Link to="/meeting" className="nav-link custom-hover d-flex align-items-center text-white">
                                <i className="bi bi-camera-video me-2"></i> Manage Meetings
                            </Link>
                        </li>
                    )}
                    <li className="nav-item mb-3">
                        <Link to="/document" className="nav-link custom-hover d-flex align-items-center text-white">
                            <i className="bi bi-pencil me-2"></i> Upload Documents
                        </Link>
                    </li>
                    {(user.role === "student" || user.role === "staff" || user.role === "admin") && (
                        <li className="nav-item mb-3">
                            <Link to="/student" className="nav-link custom-hover d-flex align-items-center text-white">
                                <i className="bi bi-person-lines-fill me-2"></i> Manage Students
                            </Link>
                        </li>
                    )}
                    {(user.role === "tutor" || user.role === "staff" || user.role === "admin") && (
                        <li className="nav-item mb-3">
                            <Link to="/tutor" className="nav-link custom-hover d-flex align-items-center text-white">
                                <i className="bi bi-person-badge-fill me-2"></i> Manage Tutors
                            </Link>
                        </li>
                    )}
                    {(user.role === "staff" || user.role === "admin") && (
                        <li className="nav-item mb-3">
                            <Link to="/user" className="nav-link custom-hover d-flex align-items-center text-white">
                                <i className="bi bi-people me-2"></i> Manage Users
                            </Link>
                        </li>
                    )}
                </ul>
            </div>
            <div className="flex-grow-1">
                <header className="d-flex justify-content-between align-items-center px-4 py-2 bg-light shadow-sm">
                    <h5 className="mb-0">
                        <small>
                            {user.is_first_login ? 'Welcome! This is your first login.' : `Last login was at ${new Date(user.last_login_at).toLocaleString()}.`}
                        </small>
                    </h5>
                    <div className="d-flex align-items-center">
                        <div className="dropdown me-3">
                            <button
                                className="dropdown-toggle"
                                style={{ border: 'none', background: 'none' }}
                                type="button"
                                id="notificationButton"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                <i className="bi bi-bell"></i>
                            </button>
                            <div className="dropdown-menu dropdown-menu-end" style={{ fontSize: '12px', width: '300px' }} aria-labelledby="notificationButton">
                                {notifications.map(notification => (
                                    <div key={notification.id} className="dropdown-item">
                                        <strong>{notification.message}</strong>
                                        <p
                                            dangerouslySetInnerHTML={{ __html: notification.detail }}
                                            style={{ wordBreak: 'break-word', whiteSpace: 'normal' }}
                                        ></p>
                                    </div>
                                ))}
                            </div>

                        </div>
                        <div className="dropdown">
                            <button
                                className="btn btn-secondary dropdown-toggle"
                                type="button"
                                id="dropdownMenuButton"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                <i className="bi bi-person-circle me-2"></i> {user.name} ({user.role})
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
                                <li>
                                    <button className="dropdown-item" onClick={handleLogout}>
                                        <i className="bi bi-box-arrow-right me-2"></i> Logout
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </header>
                <div className="p-4">
                    <Outlet />
                </div>
                <Chat />
                {/* <AudioRecorder /> */}
            </div>
        </div>
    );
}

export default Admin;
