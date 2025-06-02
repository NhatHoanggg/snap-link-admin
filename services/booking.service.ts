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
}

export function getBookings(status: string): Promise<BookingResponse[]> {
  return axiosInstance.get(`/admin/bookings?status=${status}`)
}

export function getBookingById(booking_id: number): Promise<BookingResponse> {
  return axiosInstance.get(`/admin/bookings/${booking_id}`)
}




