export type ApiResponse<T> = 
  | { data: T; error?: never; status: number }
  | { data?: never; error: string; status: number };

export type ApiRequest<T> = {
  body: T;
  headers?: Record<string, string>;
};

export function isApiError<T>(response: ApiResponse<T>): response is Extract<ApiResponse<T>, { error: string }> {
  return 'error' in response;
}

export interface DashboardStats {
  totalSales: number;
  activeCustomers: number;
  pendingOrders: number;
  revenueGrowth: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface AuthResponse {
  accessToken?: string;
  refreshToken?: string;
  user?: {
    id: string;
    email: string;
    name: string;
  };
  message?: string; // For success/error messages
}
