import { NextRequest, NextResponse } from 'next/server';
import { getApiUrl } from './config';

/**
 * Forward request to backend API
 * Helper function để proxy requests đến backend server
 */
export async function forwardToBackend(
  request: NextRequest,
  endpoint: string,
  options?: RequestInit
) {
  try {
    const url = getApiUrl(endpoint);
    
    // Get request body if it's a POST/PUT request
    let body = undefined;
    if (request.method === 'POST' || request.method === 'PUT') {
      try {
        body = await request.json();
      } catch (e) {
        // No body or invalid JSON
      }
    }

    // Forward authorization header if present
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    // Forward authorization header from client request
    const authHeader = request.headers.get('authorization');
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }
    
    // Forward other headers (except host and connection which are server-specific)
    request.headers.forEach((value, key) => {
      if (key.toLowerCase() !== 'host' && key.toLowerCase() !== 'connection') {
        headers[key] = value;
      }
    });

    const response = await fetch(url, {
      method: request.method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      ...options,
    });

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { message: 'Lỗi kết nối đến server', error: String(error) },
      { status: 500 }
    );
  }
}

/**
 * Create standard CRUD route handlers
 */
export function createCrudHandlers(resourceName: string) {
  return {
    // GET all items
    GET: async (request: NextRequest) => {
      return forwardToBackend(request, resourceName);
    },

    // POST create new item
    POST: async (request: NextRequest) => {
      return forwardToBackend(request, resourceName);
    },
  };
}

/**
 * Create handlers for item with ID
 */
export function createItemHandlers(resourceName: string) {
  return {
    // GET item by ID
    GET: async (
      request: NextRequest,
      { params }: { params: Promise<{ id: string }> }
    ) => {
      const { id } = await params;
      return forwardToBackend(request, `${resourceName}/${id}`);
    },

    // PUT update item
    PUT: async (
      request: NextRequest,
      { params }: { params: Promise<{ id: string }> }
    ) => {
      const { id } = await params;
      return forwardToBackend(request, `${resourceName}/${id}`);
    },

    // DELETE item
    DELETE: async (
      request: NextRequest,
      { params }: { params: Promise<{ id: string }> }
    ) => {
      const { id } = await params;
      return forwardToBackend(request, `${resourceName}/${id}`);
    },
  };
}

