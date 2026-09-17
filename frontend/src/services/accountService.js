import api from './api';

export const accountService = {
  /**
   * Obtiene los datos de la cuenta y el saldo del usuario autenticado.
   * @returns {Promise<{id: number, cvu: string, alias: string, balance: number, currency: string}>}
   */
  async getMyAccount() {
    const response = await api.get('/account/me');
    return response.data;
  },
};

export default accountService;