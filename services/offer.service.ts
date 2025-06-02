export interface OfferCreate {
    service_id: number;
    custom_price: number;
    message: string;
}

export interface OfferResponse {
    service_id: number;
    custom_price: number;
    message: string;
    request_offer_id: number;
    request_id: number;
    photographer_id: number;
    status: string;
    created_at: string;
}
export interface OfferDetailResponse {
    service_id: number;
    custom_price: number;
    message: string;
    request_offer_id: number;
    request_id: number;
    photographer_id: number;
    status: string;
    created_at: string;
    photographer_name: string;
    photographer_avatar: string;
    photographer_slug: string;
    service_title: string;
    service_price: number;
    service_description: string;
    service_thumbnail_url: string;
}

export interface OfferStatus {
    status: string; // "pending" | "accepted" | "rejected"
}

