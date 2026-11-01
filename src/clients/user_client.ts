import axios from "axios";

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || "http://auth-service:4000";

export class UserClient {
  /**
   * LEVEL 2 (MEDIUM): Express param style /api/v1/users/:userId/status
   * Caller uses concrete path: /api/v1/users/usr_9988/status
   */
  async getUserStatus(userId: string): Promise<{ active: boolean; tier: string }> {
    const targetUrl = `${AUTH_SERVICE_URL}/api/v1/users/${userId}/status`;
    const response = await axios.get(targetUrl);
    return response.data;
  }
}
