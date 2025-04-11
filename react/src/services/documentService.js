const API_URL = 'http://127.0.0.1:8001/api';

const documentService = {
    getDocumentById: async (documentId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/documents/${documentId}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Failed to get document information');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            throw error;
        }
    },
    getDocuments: async () => {
        try {
            const token = localStorage.getItem('token');

            let url = `${API_URL}/documents`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Error while getting list of documents');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            throw error;
        }
    },
    createDocument: async (file, comment) => {
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append('comment', comment);
    
            if (file) {
                formData.append('file', file);
            }
    
            const response = await fetch(`${API_URL}/documents`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });
    
            if (!response.ok) {
                const errorData = await response.json();
                throw errorData || { message: 'Unable to add document' };
            }
    
            return await response.json();
        } catch (error) {
            throw error.message ? error : { message: 'Unable to add document' };
        }
    },
    updateDocument: async (documentId, updateData) => {
        try {
            const token = localStorage.getItem('token');

            const body = {
                comment: updateData,
                _method: 'PUT'
            }

            const response = await fetch(`${API_URL}/documents/${documentId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw errorData || { message: 'Unable to update document' };
            }

            const data = await response.json();
            return data;
        } catch (error) {
            throw error.message ? error : { message: 'Unable to update document' };
        }
    },
    deleteDocument: async (id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_URL}/documents/${id}`, {
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
            throw error?.message || 'Document deletion failed!';
        }
    },
};

export default documentService;