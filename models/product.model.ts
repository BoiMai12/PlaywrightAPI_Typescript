export interface CreateProductRequest {
    title: string;
    description: string;
    price: number;
    stock: number;
    category: string;
}

export interface ProductResponse extends CreateProductRequest {
    id: number;
}