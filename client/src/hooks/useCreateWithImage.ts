import { useState } from 'react';
import { 
  phongApi, 
  usersApi, 
  cosoApi, 
  hangPhongApi, 
  dichVuApi, 
  nhanVienApi 
} from '../lib/api';

interface UseCreateWithImageOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

export function useCreateWithImage<T>(
  createApi: (data: unknown, imageFile?: File) => Promise<T>,
  options?: UseCreateWithImageOptions
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (data: unknown, imageFile?: File) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await createApi(data, imageFile);
      options?.onSuccess?.(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra';
      setError(errorMessage);
      options?.onError?.(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setError(null);
  };

  return {
    create,
    isLoading,
    error,
    reset,
  };
}

// Hook cụ thể cho từng entity
export function useCreateRoom() {
  return useCreateWithImage(phongApi.createWithImage);
}

export function useCreateUser() {
  return useCreateWithImage(usersApi.createWithImage);
}

export function useCreateCoSo() {
  return useCreateWithImage(cosoApi.createWithImage);
}

export function useCreateHangPhong() {
  return useCreateWithImage(hangPhongApi.createWithImage);
}

export function useCreateDichVu() {
  return useCreateWithImage(dichVuApi.createWithImage);
}

export function useCreateNhanVien() {
  return useCreateWithImage(nhanVienApi.createWithImage);
}
