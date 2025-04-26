const API_URL = "http://127.0.0.1:8001/api";

const fetchData = async (endpoint, errorMessage, params = {}) => {
    try {
        const token = localStorage.getItem("token");

        // Generate query params string if any
        const queryString = new URLSearchParams(params).toString();
        const url = `${API_URL}/${endpoint}${queryString ? `?${queryString}` : ""}`;

        const response = await fetch(url, {
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
    getMostViewedPages: (userId = null) =>
        fetchData(
            "most-viewed-pages",
            "Get list of most viewed pages failed",
            userId ? { user_id: userId } : {}
        ),

    getMostActiveUsers: () =>
        fetchData(
            "most-active-users",
            "Getting list of most active users failed"
        ),

    getMostUsedBrowsers: (userId = null) =>
        fetchData(
            "most-used-browsers",
            "Getting list of most used browsers failed",
            userId ? { user_id: userId } : {}
        ),
};

export default trackService;
