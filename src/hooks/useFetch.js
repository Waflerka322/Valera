// src/hooks/useFetch.js
import { useState, useEffect, useCallback, useRef } from 'react';
import { apiService } from '../api/apiService';

export function useFetch(endpoint) {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Контроллер для очистки памяти при размонтировании экрана (КТ №3)
  const abortControllerRef = useRef(null);

  const fetchData = useCallback(async (isPullToRefresh = false, useSignal = true) => {
    if (isPullToRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    // Создаем контроллер отмены
    const controller = new AbortController();
    if (useSignal) {
      abortControllerRef.current = controller;
    }

    // Таймаут на 7 секунд для медленного соединения (КТ №2)
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 7000);

    try {
      // Передаем сигнал отмены только если это автоматический запрос при монтировании
      const signal = useSignal ? controller.signal : null;
      const result = await apiService.get(endpoint, signal);
      setData(result || []);
    } catch (err) {
      if (err.name === 'AbortError') {
        setError('Превышено время ожидания ответа от сервера (Timeout)');
      } else {
        setError(err.message || 'Не удалось загрузить данные');
      }
    } finally {
      clearTimeout(timeoutId);
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [endpoint]);

  // Автоматический вызов при старте экрана (КТ №1)
  useEffect(() => {
    fetchData(false, true);

    // Гарантированная очистка памяти при уходе с экрана (КТ №3)
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData]);

  // Ручной перезапрос по кнопке «Повторить» (без принудительного сброса сигнала)
  const refetch = useCallback(() => {
    fetchData(false, false);
  }, [fetchData]);

  // Обновление свайпом (Pull-to-Refresh)
  const handleRefresh = useCallback(() => {
    fetchData(true, false);
  }, [fetchData]);

  return { data, isLoading, error, isRefreshing, refetch, handleRefresh };
}