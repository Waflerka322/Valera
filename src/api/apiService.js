// src/api/apiService.js
const BASE_URL = 'https://jsonplaceholder.typicode.com';

export const apiService = {
  get: async (endpoint, signal = null) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal,
    });

    if (!response.ok) {
      throw new Error(`Ошибка сервера: статус ${response.status}`);
    }

    const rawData = await response.json();
    const items = Array.isArray(rawData) ? rawData : rawData?.data;

    if (!Array.isArray(items)) {
      throw new Error('Некорректный формат данных от сервера');
    }

    return items.map((item, index) => ({
      id: item?.id ?? index,
      title: typeof item?.title === 'string' && item.title.trim() ? item.title : 'Задача без названия',
      completed: Boolean(item?.completed),
      sub: item?.sub || 'Сегодня · Колледж',
      dot: item?.dot || '#A8DADC',
    }));
  },

  post: async (endpoint, body) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error(`Ошибка создания: ${response.status}`);
    return await response.json();
  },

  patch: async (endpoint, body) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error(`Ошибка обновления: ${response.status}`);
    return await response.json();
  },

  delete: async (endpoint) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error(`Ошибка удаления: ${response.status}`);
    return true;
  },
};