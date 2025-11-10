import { API_URL, OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET, OAUTH_USERNAME, OAUTH_PASSWORD } from '../utils/constants';

let accessToken = null;

const getAccessToken = async () => {
  if (accessToken) return accessToken;

  try {
    const formData = new URLSearchParams();
    formData.append('grant_type', 'password');
    formData.append('client_id', OAUTH_CLIENT_ID);
    formData.append('client_secret', OAUTH_CLIENT_SECRET);
    formData.append('username', OAUTH_USERNAME);
    formData.append('password', OAUTH_PASSWORD);

    const response = await fetch(`${API_URL}/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      throw new Error('Erro na autenticação OAuth2');
    }

    const data = await response.json();
    accessToken = data.access_token;
    return accessToken;
  } catch (err) {
    console.error('Erro ao obter token:', err);
    throw err;
  }
};

const apiClient = {
  get: async (url) => {
    const token = await getAccessToken();
    const response = await fetch(`${API_URL}${url}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    return { data };
  },
  
  post: async (url, body) => {
    const token = await getAccessToken();
    const response = await fetch(`${API_URL}${url}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return { data };
  },
};

export default apiClient;