const API_URL = "http://127.0.0.1:8001/api";

const blogService = {
    createBlog: async (title, content, image) => {
        try {
            const token = localStorage.getItem("token");
            const formData = new FormData();
            formData.append("title", title);
            formData.append("content", content);
            if (image) {
                formData.append("image", image);
            }

            const response = await fetch(`${API_URL}/blogs`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const responseData = await response.json();
    
            if (!response.ok) {
                throw new Error(responseData.message || "Create blog fail");
            }
    
            return responseData;
        } catch (error) {
            console.error("Error API:", error);
            throw error;
        }
    },

    getBlogs: async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_URL}/blogs`, {
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

    getBlogById: async (blogId) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_URL}/blogs/${blogId}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Failed to get blog information");
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    },

    updateBlog: async (blogId, title, content, image) => {
        try {
            const token = localStorage.getItem("token");
            const formData = new FormData();
            formData.append("title", title);
            formData.append("content", content);
            if (image) {
                formData.append("image", image);
            }

            const response = await fetch(`${API_URL}/blogs/${blogId}`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Blog update failed");
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    },

    deleteBlog: async (blogId) => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_URL}/blogs/${blogId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Delete blog failed");
            }

            return await response.json();
        } catch (error) {
            throw error;
        }
    },
};

export default blogService;
