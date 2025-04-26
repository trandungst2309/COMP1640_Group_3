const API_URL = 'http://127.0.0.1:8001/api';

const userService = {
    getUserById: async (userId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/user/${userId}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Get user information failed');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            throw error;
        }
    },
    getUsers: async (role = null) => {
        try {
            const token = localStorage.getItem('token');

            let url = `${API_URL}/user`;

            if (role !== null) {
                url += `?role=${encodeURIComponent(role)}`;
            }

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Error while getting user list');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            throw error;
        }
    },
    getStudent: async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/users/freedom?role=student`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Error while getting user list');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            throw error;
        }
    },
    getTutor: async (role = 'tutor', parent_id = 0) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/users/freedom?role=` + role + `&parent_id=` + parent_id, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Error while getting user list');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            throw error;
        }
    },
    createUser: async ({ name, email, password, role }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    role,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw errorData || { message: 'Cannot add members' };
            }

            const data = await response.json();
            return data;
        } catch (error) {
            throw error.message ? error : { message: 'Cannot add members' };
        }
    },
    updateUser: async ({ userId, updateData }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/user/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(updateData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw errorData || { message: 'Cannot add members' };
            }

            const data = await response.json();
            return data;
        } catch (error) {
            throw error.message ? error : { message: 'Cannot add members' };
        }
    },
    bulkUser: async ({ userId, updateData }) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/users/bulk-update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ user_id: updateData, parent_id: parseInt(userId) }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw errorData || { message: 'Cannot add members' };
            }

            const data = await response.json();
            return data;
        } catch (error) {
            throw error.message ? error : { message: 'Cannot add members' };
        }
    },
    deleteUser: async (id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/user/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();

            if (!response.ok) {
                throw data;
            }
            return data;
        } catch (error) {
            throw error?.message || 'Delete user failed!';
        }
    },
    statistic: async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/users/statistic`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Error while getting user list');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            throw error;
        }
    },
};

export default userService;
