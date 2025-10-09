import { useState, useEffect } from 'react';
import { api, ApiError } from '../lib/api';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T>(apiCall: () => Promise<unknown>, dependencies: any[] = []) {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
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

    fetchData();

    return () => {
      isMounted = false;
    };
  }, dependencies);

  const refetch = async () => {
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
  };

  return { ...state, refetch };
}

export function useApiMutation<T, P = any>() {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const mutate = async (apiCall: (params?: P) => Promise<T>, params?: P) => {
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
  };

  return { ...state, mutate };
}
