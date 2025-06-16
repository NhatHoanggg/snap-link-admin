import axiosInstance from './axios'
import { OfferResponse } from './offer.service'
export interface CreateRequest {
    request_date: string;
    concept: string;
    estimated_budget: number;
    shooting_type: string;
    illustration_url: string;
    location_text: string;
    province: string;
}

export interface RequestResponse {
    request_date: string;
    concept: string;
    estimated_budget: number;
    shooting_type: string;
    illustration_url: string;
    location_text: string;
    province: string;
    request_id: number;
    user_id: number;
    status: string;
    created_at: string;
    request_code: string;
    offers: OfferResponse[];
}

export function getRequests() {
    return axiosInstance.get(`/admin/requests`)
}
