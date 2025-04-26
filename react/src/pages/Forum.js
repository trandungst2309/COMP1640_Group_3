import React, { useState, useEffect, useRef, useCallback } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import blogService from '../services/blogService';
import commentService from '../services/commentService';
import 'bootstrap-icons/font/bootstrap-icons.css';
import TrackPageView from '../components/TrackPageView';
function Forum() {
    const [posts, setPosts] = useState([]);
    const [title, setTitle] = useState("");
    const [newPost, setNewPost] = useState("");
    const [image, setImage] = useState(null);
    const [link, setLink] = useState(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const blogs = await blogService.getBlogs();
                setPosts(blogs.data.data);
            } catch (error) {
                console.error("Error getting blog list:", error);
            }
        };

        fetchPosts();
    }, []);

    const handlePostSubmit = async () => {
        if (title.trim() && (newPost.trim() || image)) {
            const isConfirmed = window.confirm(`Do you agree to submit the post?`);
            if (!isConfirmed) return;
            try {
                const newBlog = await blogService.createBlog(title, newPost, image); // Call API to create blog
                setPosts([newBlog.data, ...posts]); // Update article list with data from API

                // Reset form
                setTitle("");
                setNewPost("");
                setLink(null);
                fileInputRef.current.value = "";
                document.getElementById("closeModal").click(); // Close modal
            } catch (error) {
                console.error("Error creating post:", error);
                alert("An error occurred while creating the post!");
            }
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setLink(URL.createObjectURL(file));
        }
    };

    const handleDelete = async (id) => {
        const isConfirmed = window.confirm(`Are you sure you want to delete this comment?`);
        if (!isConfirmed) return;

        try {
            const response = await blogService.deleteBlog(id);
            if (response.status) {
                setPosts(prevData => prevData.filter(blog => blog.id !== id));
            }
        } catch (error) {
            console.log(`Error: ${error.response?.data?.message || error.message}`);
        }
    }

    return (
        <div className="container mt-4">
            <TrackPageView page="Blog" />
            <h2 className="mb-2">📢 Blog</h2>
            <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#postModal">
                ✏️ Post blog
            </button>

            {/* Bootstrap Modal */}
            <div className="modal fade" id="postModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">📝 Post new</h5>
                            <button id="closeModal" className="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label">📌 Title</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Enter article title..."
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">✍️ Content</label>
                                <textarea
                                    className="form-control"
                                    rows="3"
                                    value={newPost}
                                    onChange={(e) => setNewPost(e.target.value)}
                                    placeholder="Enter article content..."
                                ></textarea>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">🖼️ Image</label>
                                <input
                                    type="file"
                                    className="form-control"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    ref={fileInputRef}
                                />
                                {link && <img src={link} alt="Preview" className="mt-2 img-thumbnail" style={{ maxWidth: '150px' }} />}
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-primary" onClick={handlePostSubmit}>🚀 Post</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* List of articles */}
            <div className="mt-4">
                <div className="row">
                    {posts.map(post => (
                        <Post key={post.id} post={post} handleD={handleDelete} />
                    ))}
                </div>
            </div>
        </div>
    );
}

function Post({ post, handleD }) {
    const [showModal, setShowModal] = useState(false);
    const [comment, setComment] = useState("");
    const [files, setFiles] = useState([]);
    const [number, setNumber] = useState(0);
    const [comments, setComments] = useState([]);

    const fetchComments = useCallback(async () => {
        try {
            const res = await commentService.getComments(post.id);
            setComments(res.data.data);
        } catch (error) {
            console.error("Error while getting comments:", error);
        }
    }, [post.id]); // Add post.id to dependency to avoid error

    useEffect(() => {
        if (showModal) {
            fetchComments(); // Call API when opening modal
        }
    }, [showModal, fetchComments]); // Add fetchComments to dependency array

    const handleFileChange = (event) => {
        const selectedFiles = event.target.files;
        setFiles([...selectedFiles]);
        setNumber(selectedFiles.length > 0 ? 1 : 0);
    };

    const handleCommentSubmit = async () => {
        try {
            const newComment = await commentService.createComment(comment, files[0], post.id);
            setComments((prevComments) => [newComment.data, ...prevComments]);
            setComment("");
            setFiles([]);
            setNumber(0);
        } catch (error) {
            console.error("Error creating post:", error);
            alert("An error occurred while creating the post!");
        }
    };

    const handleDelete = (id) => {
        handleD(id);
    }

    return (
        <div className="col-md-6">
            <div className="card mb-3 p-3 shadow-sm">
                <div className="row g-3">
                    {/* Left Column: Image */}
                    <div className="col-md-2 text-center d-flex align-items-center justify-content-center">
                        {post.image ? (
                            <img src={post.image} alt="Post" className="img-fluid rounded shadow-sm" style={{ maxHeight: '150px', objectFit: 'cover' }} />
                        ) : (
                            <i className="bi bi-image text-secondary" style={{ fontSize: '3rem' }}></i>
                        )}
                    </div>

                    <div className="col-md-10">
                        <div className="d-flex align-items-center">
                            <i className="bi bi-person-circle me-2 text-secondary" style={{ fontSize: '1.5rem' }}></i>
                            <h5 className="card-title mb-0">{post.title}</h5>
                        </div>

                        <p className="card-text mt-2"><i className="bi bi-file-text me-1"></i> {post.content}</p>

                        <div className="d-flex justify-content-start mt-3 gap-2">
                            {/* <button className="btn btn-outline-primary btn-sm">
                                <i className="bi bi-hand-thumbs-up"></i> 
                            </button> */}
                            <button className="btn btn-outline-secondary btn-sm me-auto" onClick={() => setShowModal(true)}>
                                <i className="bi bi-chat-dots"></i> Comment
                            </button>
                            {/* <button className="btn btn-outline-danger btn-sm">
                                <i className="bi bi-share"></i> 
                            </button> */}
                            <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(post.id)}>
                                <i className="bi bi-trash"></i> Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bootstrap Modal */}
            <div className={`modal fade ${showModal ? "show d-block" : ""}`} tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title"><small>({post.id})</small> Comment on the article: <b className="text-primary">{post.title}</b></h5>
                            <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                        </div>
                        <div className="modal-body">
                            {/* List of comments */}
                            <ul className="list-group mb-3" style={{ maxHeight: "300px", overflowY: "auto" }}>
                                {comments && comments.map((comment) => (
                                    <li key={comment.id} className="list-group-item d-flex align-items-start">
                                        {/* Avatar User */}
                                        <img
                                            src={comment.image || "/logo192.png"}
                                            alt="User Avatar"
                                            className="rounded-circle me-2"
                                            style={{ width: "40px", height: "40px", objectFit: "cover" }}
                                        />

                                        {/*Comment content*/}
                                        <div>
                                            {/* Commenter Name */}
                                            <strong>{comment.user?.name || "Anonymous"}</strong>

                                            {/* Date created (DD/MM/YYYY format) */}
                                            <small className="text-muted ms-2">
                                                {new Date(comment.created_at).toLocaleDateString("vi-VN")}
                                            </small>

                                            {/* Comment content */}
                                            <p className="mb-1">{comment.comment}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            {/* Comment form */}
                            <div className="d-flex align-items-center position-relative">
                                {/* Comment input box (80%) */}
                                <input
                                    type="text"
                                    className="form-control flex-grow-1 me-2"
                                    placeholder="Enter comment..."
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    style={{ width: "80%" }}
                                />

                                {/* Icon file (10%) */}
                                <label htmlFor="fileUpload" className="d-flex align-items-center justify-content-center text-primary position-relative" style={{ width: "10%", cursor: "pointer" }}>
                                    <i className="bi bi-paperclip" style={{ fontSize: "1.5rem" }}></i>
                                    {/* Badge shows the number of selected files */}
                                    {(number !== 0) && (
                                        <span className="position-absolute top-0 start-10 translate-middle badge rounded-pill bg-danger">
                                            {number}
                                        </span>
                                    )}
                                </label>
                                <input
                                    type="file"
                                    id="fileUpload"
                                    className="d-none"
                                    onChange={handleFileChange}
                                    multiple
                                />

                                {/* Submit button (10%) */}
                                <button className="btn btn-primary" style={{ width: "10%" }} onClick={handleCommentSubmit}>
                                    <i className="bi bi-send"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Forum;
