import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Pagination, Modal } from 'react-bootstrap';
import { FaEdit, FaTrashAlt, FaPlus, FaEye } from 'react-icons/fa';
import documentService from '../services/documentService';
import { toast, ToastContainer } from 'react-toastify';
import TrackPageView from '../components/TrackPageView';

const paginate = (items, currentPage, perPage) => {
    const startIndex = (currentPage - 1) * perPage;
    return items.slice(startIndex, startIndex + perPage);
};

function Document() {
    const [documents, setDocuments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [showCommentModal, setShowCommentModal] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [comment, setComment] = useState('');
    const perPage = 5;

    useEffect(() => {
        const fetchDocuments = async () => {
            const data = await documentService.getDocuments();
            setDocuments(data?.data);
        };
        fetchDocuments();
    }, []);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            toast.error('Please select file first!', { position: 'top-center', autoClose: 2000 });
            return;
        }

        try {

            const newDoc = await documentService.createDocument(selectedFile, '');
            toast.success('Create document successfully!', { position: 'top-center', autoClose: 2000 });

            // Cập nhật danh sách tài liệu
            setDocuments([...documents, newDoc.data]);

            // Đóng modal sau khi tải xong
            setShowModal(false);
            setSelectedFile(null);
        } catch (error) {
            console.error('Lỗi:', error);
            toast.error('Document creation failed!', { position: 'top-center', autoClose: 2000 });
        }
    };

    const handleShowCommentModal = (doc) => {
        setSelectedDocument(doc);
        setComment(doc.comment || ''); // Nếu đã có bình luận, hiển thị lên
        setShowCommentModal(true);
    };

    const handleUpdateComment = async () => {
        if (!selectedDocument) return;

        try {
            await documentService.updateDocument(selectedDocument.id, comment);
            toast.success('Comment updated successfully!', { position: 'top-center', autoClose: 2000 });

            // Cập nhật danh sách tài liệu
            setDocuments(documents.map(doc =>
                doc.id === selectedDocument.id ? { ...doc, comment } : doc
            ));

            setShowCommentModal(false);
        } catch (error) {
            toast.error('Comment update failed!', { position: 'top-center', autoClose: 2000 });
        }
    };


    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this document??')) return;
        try {
            await documentService.deleteDocument(id);
            toast.success('Document deleted successfully!', { position: 'top-center', autoClose: 2000 });
            setDocuments(documents.filter(doc => doc.id !== id));
        } catch (error) {
            toast.error('Document deletion failed!', { position: 'top-center', autoClose: 2000 });
        }
    };

    const filteredDocuments = Array.isArray(documents) ? documents.filter(doc =>
        doc.file_path?.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    const paginatedDocuments = paginate(filteredDocuments, currentPage, perPage);
    const totalPages = Math.ceil(filteredDocuments.length / perPage);

    const url = 'http://127.0.0.1:8001/storage/';

    return (
        <div className="container mt-4">
            <TrackPageView page="Document Management" />
            <ToastContainer />
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2><i className="bi bi-pencil me-2"></i>Document Management</h2>
                <div className="d-flex">
                    <Form.Control
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="me-2"
                        style={{ maxWidth: '250px' }}
                    />
                    <Button variant="primary" onClick={() => setShowModal(true)} style={{ display: 'flex', alignItems: 'center' }}>
                        <FaPlus className="me-2" /> Add
                    </Button>
                </div>
            </div>
            <Table bordered hover responsive>
                <thead className="table-dark">
                    <tr>
                        <th>#</th>
                        <th>Document Name</th>
                        <th>Poster</th>
                        <th>Posted Date</th>
                        <th style={{ width: '250px' }}>Function</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedDocuments.length > 0 ? (
                        paginatedDocuments.map((doc, index) => (
                            <tr key={doc.id} className='align-middle'>
                                <td>{(currentPage - 1) * perPage + index + 1}</td>
                                <td>
                                    <span className='me-1'>Document:</span>
                                    <span>
                                        <a href={`${url + doc.file_path}`} target="_blank" rel="noopener noreferrer">
                                            <FaEye style={{ color: 'green', fontSize: '13px', cursor: 'pointer' }} title="View document" />
                                        </a>
                                    </span>
                                    <br />
                                    <b>{doc.file_path.split('/').pop()}</b>
                                </td>
                                <td>{doc.user.name || ''}</td>
                                <td>{new Intl.DateTimeFormat('vi-VN', {
                                    day: '2-digit', month: '2-digit', year: 'numeric',
                                    hour: '2-digit', minute: '2-digit'
                                }).format(new Date(doc.created_at))}</td>
                                <td>
                                    <Button variant="warning" size="sm" className="me-2" onClick={() => handleShowCommentModal(doc)}>
                                        <FaEdit /> Add Comment
                                    </Button>

                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => handleDelete(doc.id)}
                                    >
                                        <FaTrashAlt /> Delete
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="text-center">No data found</td>
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

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Select File</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Select document:</Form.Label>
                        <Form.Control type="file" onChange={handleFileChange} />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                    <Button variant="primary" onClick={handleUpload}>Confirm</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showCommentModal} onHide={() => setShowCommentModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Add Comment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Comment:</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={4}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowCommentModal(false)}>Cancel</Button>
                    <Button variant="primary" onClick={handleUpdateComment}>Save</Button>
                </Modal.Footer>
            </Modal>

        </div>
    );
}

export default Document;
