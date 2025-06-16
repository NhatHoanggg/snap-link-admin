import axiosInstance from "./axios";

export interface Review{
    rating: number;
    comment: string;
    review_id: number;
    booking_id: number;
    customer_id: number;
    photographer_id: number;
    created_at: string;
    customer_name: string | null;
    customer_avatar: string | null;
}

export interface ReviewResponse{
    total: number,
    reviews: Review[]
}

export const getReviews = async () => {
    try {
        const response = await axiosInstance.get(`admin/reviews`);
        return response.data;
    } catch (error) {
        throw error;
    }
}


export const deleteReview = async (review_id: number) => {
    try {
        const response = await axiosInstance.delete(`admin/reviews/${review_id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

