export interface Availability {
  available_date: string
  status: "available" | "booked"
  availability_id: number
  created_at: string
}

export interface CreateAvailabilityRequest {
  available_date: string,
  status: "available"
}

export interface UpdateAvailabilityRequest {
  available_date: string,
  status: "available" | "booked"
}

