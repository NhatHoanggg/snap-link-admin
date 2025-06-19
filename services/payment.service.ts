import axiosInstance from "./axios";

export interface Payment {
  booking_code: string,
  amount: number,
  payment_type: string,
  order_code: string,
  status: string,
  payment_id: string,
  user_id: number,
  paid_at: string
}

export interface PaymentHistoryResponse {
  total: number;
  payments: Payment[];
}

export interface PaymentMethod {
  method: string;
  count: number;
  amount: number;
}

export interface PaymentType {
  type: string;
  count: number;
  amount: number;
}

export interface MonthlyData {
  month: string;
  count: number;
  amount: number;
}

export interface PaymentStatistics {
  total_amount: number;
  total_count: number;
  payment_methods: PaymentMethod[];
  payment_types: PaymentType[];
  monthly_data: MonthlyData[];
}

export interface MonthlyComparison {
  current_month: {
    count: number;
    amount: number;
  };
  previous_month: {
    count: number;
    amount: number;
  };
  comparison: {
    count_change: number;
    amount_change: number;
  };
}

export interface QRCreate{
  bank_name: string;
  account_number: string;
  amount: number;
  addition_info: string;
}

export interface PaymentInfo{
  bank_name: string;
  account_number: string;
}

export async function getPaymentHistory() {
  const response = await axiosInstance.get<PaymentHistoryResponse>('/admin/payments');
  return response.data;
}

export async function getPaymentStatistics() {
  const response = await axiosInstance.get<PaymentStatistics>('/admin/payments/statistics');
  return response.data;
}

export async function getMonthlyComparison() {
  const response = await axiosInstance.get<MonthlyComparison>('/admin/payments/monthly-comparison');
  return response.data;
}

export async function createQR(data: QRCreate ) {
  const response = await axiosInstance.post('/photographers/qr', data);
  return response.data;
}

export async function getPaymentInfo(photographer_id: number) {
  const response = await axiosInstance.get(`/admin/photographers/payment-info?photographer_id=${photographer_id}`);
  return response.data;
}