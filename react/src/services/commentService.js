const API_URL = "http://127.0.0.1:8001/api";

const commentService = {
    createComment: async (comment, image, blog_id) => {
        try {
            const token = localStorage.getItem("token");
            const formData = new FormData();
            formData.append("comment", comment);
            formData.append("blog_id", blog_id);
            if (image) {
                formData.append("image", image);
            }

            const response = await fetch(`${API_URL}/comments`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const responseData = await response.json();
            
            if (!response.ok) {
                throw new Error(responseData.message || "Blog Creation Failed");
            }
    
            return responseData;
        } catch (error) {
            console.error("Error API:", error);
            throw error;
        }
    },

    getComments: async (blog_id) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_URL}/comments?blog_id=${blog_id}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Get blog list failed");
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    },

    getCommentById: async (commentId) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_URL}/comments/${commentId}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Get comment information failed");
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    },

    updateComment: async (commentId, comment, image) => {
        try {
            const token = localStorage.getItem("token");
            const formData = new FormData();
            formData.append("comment", comment);
            if (image) {
                formData.append("image", image);
            }

            const response = await fetch(`${API_URL}/comments/${commentId}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Comment update failed");
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    },

    deleteComment: async (commentId) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_URL}/comments/${commentId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Delete comment failed");
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    },
};

export default commentService;
