const API_URL = "http://127.0.0.1:8001/api";

const logService = {
    getLogs: async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_URL}/activity-logs`, {
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
};

export default logService;
