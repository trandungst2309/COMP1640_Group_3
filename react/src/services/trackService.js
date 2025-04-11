const API_URL = "http://127.0.0.1:8001/api";

const fetchData = async (endpoint, errorMessage) => {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${API_URL}/${endpoint}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
};

const trackService = {
    getMostViewedPages: () => fetchData("most-viewed-pages", "Get list of most viewed pages failed"),
    getMostActiveUsers: () => fetchData("most-active-users", "Getting list of most active users failed"),
    getMostUsedBrowsers: () => fetchData("most-used-browsers", "Getting list of most used browsers failed"),
};

export default trackService;
