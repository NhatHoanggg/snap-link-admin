import axiosInstance from "./axios"
export interface BookingResponse {
  booking_id: number
  customer_id: number
  photographer_id: number
  service_id: number
  booking_date: string
  location_id: number
  custom_location: string
  quantity: number
  shooting_type: string
  status: string
  created_at: string
  concept: string
  illustration_url: string
  availability_id: number
  booking_code: string
  total_price: number
  discount_code: string
  province: string
  payment_status: string | null
}

export interface BookingDistribution{
  confirm:number;
  completed: number;
  pending: number;
  cancelled: number;
  accepted: number;
}

export function getBookings() {
  return axiosInstance.get(`/admin/bookings`)
}

export async function getMyBookingsByStatus(status: string) {
  const response = await axiosInstance.get(`/admin/bookings/status/${status}`)
  return response.data
}

export async function getBookingByCode(booking_code: string) {
  const response = await axiosInstance.get(`/admin/bookings/code/${booking_code}`)
  return response.data
}

export async function getBookingDistribution() {
  const response = await axiosInstance.get(`/admin/distribution/booking`)
  return response.data
}


