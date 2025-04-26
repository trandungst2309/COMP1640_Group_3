const API_URL = 'http://127.0.0.1:8001/api';

const meetingService = {
    getMeetingById: async (meetingId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/meetings/${meetingId}`, {
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
    getMeetings: async () => {
        try {
            const token = localStorage.getItem('token');

            let url = `${API_URL}/meetings`;

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
    createMeeting: async ({ name, type, status='pending', start_time, end_time, students, tutors }) => {
        try {
            const token = localStorage.getItem('token');
            
            const dataF = {
                name, 
                type, 
                status, 
                start_time, 
                end_time, 
                student_id: students, 
                tutor_id: tutors
            };

            const response = await fetch(`${API_URL}/meetings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(dataF),
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
    updateMeeting: async (meetingId, { name, type, status='pending', start_time, end_time, students, tutors }) => {
        try {
            const token = localStorage.getItem('token');
            
            const dataF = {
                name, 
                type, 
                status, 
                start_time, 
                end_time, 
                student_id: students, 
                tutor_id: tutors
            };

            const response = await fetch(`${API_URL}/meetings/${meetingId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(dataF),
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
    deleteMeeting: async (id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/meetings/${id}`, {
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
};

export default meetingService;
