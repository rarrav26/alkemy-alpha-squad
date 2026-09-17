import api from './api';

/**
 * Returns the auth header with the JWT token from localStorage.
 */
function authHeader() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const accountService = {
  /**
   * Deposit money into the authenticated user's account.
   * @param {number} amount - The amount to deposit (> 0, max 2 decimals).
   * @returns {Promise<{transactionId: number, amount: number, newBalance: number, date: string, message: string}>}
   */
  async deposit(amount) {
    const response = await api.post(
      '/account/deposit',
      { amount },
      { headers: authHeader() }
    );
    return response.data;
  },

  /**
   * Fetch the current balance and account info of the authenticated user.
   * @returns {Promise<{id: number, balance: number, currency: string, alias: string, cvu: string, createdAt: string}>}
   */
  async getBalance() {
    const response = await api.get('/account/balance', {
      headers: authHeader(),
    });
    return response.data;
  },

  /**
   * Check recipient information by Alias or CVU before transferring.
   * @param {string} destination - Alias or 22-digit CVU.
   * @returns {Promise<{accountId: number, recipientName: string, alias: string, cvu: string}>}
   */
  async lookupRecipient(destination) {
    const response = await api.get('/account/lookup', {
      params: { destination },
      headers: authHeader(),
    });
    return response.data;
  },

  /**
   * Transfer money to another account by Alias or CVU.
   * @param {string} destination - Alias or 22-digit CVU.
   * @param {number} amount - The amount to transfer (> 0, max 2 decimals).
   * @returns {Promise<{debitTransactionId: number, creditTransactionId: number, amount: number, newBalance: number, recipientName: string, recipientAlias: string, recipientCvu: string, date: string, message: string}>}
   */
  async transfer(destination, amount) {
    const response = await api.post(
      '/account/transfer',
      { destination, amount },
      { headers: authHeader() }
    );
    return response.data;
  },
};

export default accountService;
