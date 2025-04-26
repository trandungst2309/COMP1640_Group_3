import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Card, Row, Col, Table } from "react-bootstrap";
import { FaUserGraduate, FaChalkboardTeacher, FaUsers, FaBook, FaCalendarCheck } from "react-icons/fa";
import userService from "../services/userService";
import TrackPageView from "../components/TrackPageView";
import trackService from "../services/trackService";

function Dashboard() {
    const [statistic, setStatistic] = useState([]);
    const [mostViewedPages, setMostViewedPages] = useState([]);
    const [mostActiveUsers, setMostActiveUsers] = useState([]);
    const [mostUsedBrowsers, setMostUsedBrowsers] = useState([]);

    const [user] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : { name: 'Admin', role: 'guest' };
    });

    const [selectedUserId, setSelectedUserId] = useState(user.id);

    useEffect(() => {
        const fetchData = async () => {
            // Get general statistics
            const userStats = await userService.statistic();
            setStatistic(userStats?.data);

            // Get list of most viewed pages
            const pagesData = await trackService.getMostViewedPages(user.id);
            setMostViewedPages(pagesData?.data || []);

            // Get list of most active users
            const usersData = await trackService.getMostActiveUsers();
            setMostActiveUsers(usersData?.data || []);

            // Get list of most used browsers
            const browsersData = await trackService.getMostUsedBrowsers(user.id);
            setMostUsedBrowsers(browsersData?.data || []);
        };

        fetchData();
    }, [user.id]);


    const stats = [
        { id: 1, title: "Number of students", count: statistic.student, icon: <FaUserGraduate size={30} className="text-primary" /> },
        { id: 2, title: "Number of tutors", count: statistic.tutor, icon: <FaChalkboardTeacher size={30} className="text-success" /> },
        { id: 3, title: "Number of staffs", count: statistic.staff, icon: <FaUsers size={30} className="text-warning" /> },
        { id: 4, title: "Documents", count: statistic.documents, icon: <FaBook size={30} className="text-info" /> },
        { id: 5, title: "Meetings", count: statistic.meetings, icon: <FaCalendarCheck size={30} className="text-danger" /> },
    ];

    // Function to handle when selecting a user
    const handleUserChange = async (e) => {
        const userId = e.target.value;
        setSelectedUserId(userId);

        // Call back data by userId
        try {
            const pagesData = await trackService.getMostViewedPages(userId);
            setMostViewedPages(pagesData?.data || []);

            const browsersData = await trackService.getMostUsedBrowsers(userId);
            setMostUsedBrowsers(browsersData?.data || []);
        } catch (err) {
            console.error("Error loading data by userId:", err);
        }
    };


    return (
        <div className="container mt-4">
            <TrackPageView page="Dashboard" />
            <h2 className="mb-4">Dashboard</h2>

            {/* General Statistics */}
            <Row>
                {stats.map((stat) => (
                    <Col key={stat.id} md={4} className="mb-3">
                        <Card className="shadow-sm p-3 text-center">
                            <Card.Body>
                                {stat.icon}
                                <Card.Title className="mt-2">{stat.title}</Card.Title>
                                <Card.Text className="display-6 fw-bold">{stat.count}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* User filter dropdown */}
            {user.role === 'staff' && (
                <div className="row">
                    <div className="col-md-3">
                        <label className="form-label fw-bold">Filter by user:</label>
                        <select
                            className="form-select"
                            value={selectedUserId}
                            onChange={handleUserChange}
                        >
                            <option value="">All users</option>
                            {mostActiveUsers && mostActiveUsers.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            )}


            <div className="mt-4">
                {/* Most Viewed Pages Table */}
                <h3>📊 Most viewed pages</h3>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th style={{ width: '10%' }}>#</th>
                            <th style={{ width: '50%' }}>Pages</th>
                            <th style={{ width: '40%' }}>Views</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mostViewedPages.length > 0 ? (
                            mostViewedPages.map((page, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{page.page}</td>
                                    <td>
                                        <span className="me-1">{page.views}</span>
                                    </td>

                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="text-center">No data available</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>

            {/* Most used browser panel */}
            <div className="mt-4">
                <h3>🌐 Most used browser</h3>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th style={{ width: '10%' }}>#</th>
                            <th style={{ width: '50%' }}>Browser</th>
                            <th style={{ width: '40%' }}>Number of uses</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mostUsedBrowsers.length > 0 ? (
                            mostUsedBrowsers.map((browser, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{browser.browser}</td>
                                    <td>
                                        <span className="me-1">{browser.usage}</span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="text-center">No data available</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>

            {/* Most Active Users Table */}
            <div className="mt-4">
                <h3>👥 Most active users</h3>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th style={{ width: '10%' }}>#</th>
                            <th style={{ width: '50%' }}>User name</th>
                            <th style={{ width: '40%' }}>Number of operations</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mostActiveUsers.length > 0 ? (
                            mostActiveUsers.map((user, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{user.name}</td>
                                    <td>{user.activity}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="text-center">No data available</td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>
        </div>
    );
}

export default Dashboard;
