import axiosInstance from "./axios"

export interface DashboardResponse {
    current_month: {
        total_bookings: number
        total_revenue: number
        total_requests: number
        total_users: number
        total_photographers: number
        total_reviews: number
        total_posts: number
    }
    previous_month: {
        total_bookings: number
        total_revenue: number
        total_requests: number
        total_users: number
        total_photographers: number
        total_reviews: number
        total_posts: number
    }
    comparison: {
        total_bookings: number
        total_revenue: number
        total_requests: number
        total_users: number
        total_photographers: number
        total_reviews: number
        total_posts: number
    }
}

export interface RevenueDataPoint {
    "name": string
    "Doanh_thu": number
}

export interface BookingDataPoint {
    "name": string
    "Dat_lich": number
}

export interface UserDistributionDataPoint {
    "name": string
    "value": number
}

export interface BookingStatusDataPoint {
    "name": string
    "value": number
}

export interface RevenueDataResponse {
    revenue_data: RevenueDataPoint[]
}

type TimeframeType = 'week' | 'month' | 'year'


export function getMonthlyComparison(): Promise<DashboardResponse> {
    return axiosInstance.get('/admin/monthly-comparison')
}

export function getRevenueData(timeframe: TimeframeType): Promise<RevenueDataResponse> {
    return axiosInstance.get('/admin/dashboard/revenue', {
        params: {
            timeframe
        }
    })
}

export function getBookingData(timeframe: TimeframeType): Promise<BookingDataPoint[]> {
    return axiosInstance.get('/admin/dashboard/bookings', {
        params: {
            timeframe
        }
    })
}

export function getUserDistributionData(timeframe: TimeframeType): Promise<UserDistributionDataPoint[]> {
    return axiosInstance.get('/admin/dashboard/user-distribution', {
        params: {
            timeframe
        }
    })
}

export function getBookingStatusData(timeframe: TimeframeType): Promise<BookingStatusDataPoint[]> {
    return axiosInstance.get('/admin/dashboard/booking-status', {
        params: {
            timeframe
        }
    })
}

