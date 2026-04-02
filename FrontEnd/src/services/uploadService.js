import api from './api';

export const uploadService = {
  // Upload image file
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    // Use simple upload endpoint without authentication
    const response = await api.post('/simple-upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },
};