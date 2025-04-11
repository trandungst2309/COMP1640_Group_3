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

    useEffect(() => {
        const fetchData = async () => {
            // Lấy thống kê chung
            const userStats = await userService.statistic();
            setStatistic(userStats?.data);

            // Lấy danh sách trang được xem nhiều nhất
            const pagesData = await trackService.getMostViewedPages();
            setMostViewedPages(pagesData?.data || []);

            // Lấy danh sách người dùng hoạt động nhiều nhất
            const usersData = await trackService.getMostActiveUsers();
            setMostActiveUsers(usersData?.data || []);

            // Lấy danh sách trình duyệt được sử dụng nhiều nhất
            const browsersData = await trackService.getMostUsedBrowsers();
            setMostUsedBrowsers(browsersData?.data || []);
        };

        fetchData();
    }, []);

    const stats = [
        { id: 1, title: "Number of students", count: statistic.student, icon: <FaUserGraduate size={30} className="text-primary" /> },
        { id: 2, title: "Number of tutors", count: statistic.tutor, icon: <FaChalkboardTeacher size={30} className="text-success" /> },
        { id: 3, title: "Number of staffs", count: statistic.staff, icon: <FaUsers size={30} className="text-warning" /> },
        { id: 4, title: "Documents", count: statistic.documents, icon: <FaBook size={30} className="text-info" /> },
        { id: 5, title: "Mettings", count: statistic.meetings, icon: <FaCalendarCheck size={30} className="text-danger" /> },
    ];

    return (
        <div className="container mt-4">
            <TrackPageView page="Dashboard" />
            <h2 className="mb-4">Dashboard</h2>

            {/* Thống kê chung */}
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

            {/* Bảng trang được xem nhiều nhất */}
            <div className="mt-4">
                <h3>📊 Most viewed pages</h3>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th style={{width: '5%'}}>#</th>
                            <th style={{width: '25%'}}>Page</th>
                            <th style={{width: '70%'}}>Views</th>
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
                                        (
                                        {page.detail.map((user, index) => (
                                            <span key={index}>
                                                {user.name}: {user.count}
                                                {index < page.detail.length - 1 && ", "} {/* Thêm dấu phẩy giữa các user nếu không phải user cuối */}
                                            </span>
                                        ))}
                                        )
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

            {/* Bảng người dùng hoạt động nhiều nhất */}
            <div className="mt-4">
                <h3>👥 Most active users</h3>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th style={{width: '5%'}}>#</th>
                            <th style={{width: '55%'}}>User name</th>
                            <th style={{width: '40%'}}>Number of operations</th>
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

            {/* Bảng trình duyệt được sử dụng nhiều nhất */}
            <div className="mt-4">
                <h3>🌐 Most used browser</h3>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th style={{width: '5%'}}>#</th>
                            <th style={{width: '55%'}}>Browser</th>
                            <th style={{width: '40%'}}>Number of uses</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mostUsedBrowsers.length > 0 ? (
                            mostUsedBrowsers.map((browser, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{browser.browser}</td>
                                    <td>
                                        <span className="me-1">{browser.browser_usage}</span>
                                        (
                                        {browser.detail.map((user, index) => (
                                            <span key={index}>
                                                {user.name}: {user.count}
                                                {index < browser.detail.length - 1 && ", "} {/* Thêm dấu phẩy giữa các user nếu không phải user cuối */}
                                            </span>
                                        ))}
                                        )
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
        </div>
    );
}

export default Dashboard;
