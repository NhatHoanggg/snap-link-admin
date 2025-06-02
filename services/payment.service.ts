import axiosInstance from "./axios";
export interface Payment {
  amount: string;
  payment_type: string;
  payment_method: string;
  transaction_id: string;
  info: string;
  payment_id: number;
  booking_id: number;
  user_id: number;
  paid_at: string;
}

export interface PaymentResponse {
  total: number;
  payments: Payment[];
}

export function getPayments(year: number | null, month: number | null): Promise<PaymentResponse> {
  return axiosInstance.get(`/admin/payments/history?year=${year}&month=${month}`)
      .then(response => response.data)
      .then(data => data as PaymentResponse);
}




