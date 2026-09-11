import api from './api';

export const authService = {
  /**
   * Fetch available document types for registration.
   * @returns {Promise<Array<{id: number, code: string, name: string}>>}
   */
  async getDocumentTypes() {
    const response = await api.get('/auth/document-types');
    return response.data;
  },

  /**
   * Register a new user and create an initial account.
   * @param {Object} userData
   * @param {string} userData.firstName
   * @param {string} userData.lastName
   * @param {number} userData.documentTypeId
   * @param {string} userData.documentNumber
   * @param {string} userData.email
   * @param {string} userData.password
   * @returns {Promise<Object>}
   */
  async registerUser(userData) {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
};

export default authService;
