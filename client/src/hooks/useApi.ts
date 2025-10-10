'use client';

import { useState, useEffect, useCallback } from 'react';
import { ApiError } from '../lib/api';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T>(apiCall: () => Promise<unknown>, dependencies: unknown[] = []) {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;

    const executeFetch = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }));
        const result = await apiCall();
        
        if (isMounted) {
          setState({ data: result as T, loading: false, error: null });
        }
      } catch (error) {
        if (isMounted) {
          const errorMessage = error instanceof ApiError 
            ? error.message 
            : 'Có lỗi xảy ra khi tải dữ liệu';
          setState({ data: null, loading: false, error: errorMessage });
        }
      }
    };

    executeFetch();

    return () => {
      isMounted = false;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  const refetch = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const result = await apiCall();
      setState({ data: result as T, loading: false, error: null });
    } catch (error) {
      const errorMessage = error instanceof ApiError 
        ? error.message 
        : 'Có lỗi xảy ra khi tải dữ liệu';
      setState({ data: null, loading: false, error: errorMessage });
    }
  }, [apiCall]);

  return { ...state, refetch };
}

export function useApiMutation<T, P = unknown>() {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const mutate = useCallback(async (apiCall: (params?: P) => Promise<T>, params?: P) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const result = await apiCall(params);
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (error) {
      const errorMessage = error instanceof ApiError 
        ? error.message 
        : 'Có lỗi xảy ra khi thực hiện thao tác';
      setState({ data: null, loading: false, error: errorMessage });
      throw error;
    }
  }, []);

  return { ...state, mutate };
}
