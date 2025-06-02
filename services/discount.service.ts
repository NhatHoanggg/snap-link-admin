
export interface DiscountCreate {
    code: string,
    description: string,
    discount_type: "fixed" | "percent",
    value: number,
    max_uses: number,
    valid_from: string,
    valid_to: string,
    is_active: boolean
}

export interface Discount {
    code: string,
    description: string,
    discount_type: "fixed" | "percent",
    value: number,
    max_uses: number,
    valid_from: string,
    valid_to: string,
    is_active: boolean,
    id: number,
    current_uses: number
}

export interface PhotographerDiscountListResponse {
    total: number,
    discounts: PhotographerDiscount[]
}

export interface PhotographerDiscount {
    code: string,
    description: string,
    discount_type: "fixed" | "percent",
    value: number,
    max_uses: number,
    valid_from: string,
    valid_to: string,
    is_active: boolean,
    id: number,
    current_uses: number,
    is_saved: boolean,
    times_used: number
}
export interface DiscountResponse {
    total: number,
    discounts: Discount[]
}


export interface SavedDiscount {
    id: number,
    user_id: number,
    discount_id: number,
    times_used: number,
    photographer_id: number,
    discount: Discount
}
export interface SavedDiscountResponse {
    total: number,
    user_discounts: SavedDiscount[]
}
