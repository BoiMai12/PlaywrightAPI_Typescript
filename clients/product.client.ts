import { APIRequest, APIResponse } from "@playwright/test";
import { BaseClient } from "./base.client";
import { CreateProductRequest } from "../models/product.model";


export class ProductClient extends BaseClient {
    private readonly endpoint = '/products';

    async getProductById(productId: number): Promise<APIResponse> {
        return this.get(`${this.endpoint}/${productId}`)
    }

    async addProduct(payload: CreateProductRequest): Promise<APIResponse> {
        return this.post(`${this.endpoint}/add`, payload)
    }

    async updateProduct(productId: number, payload: CreateProductRequest): Promise<APIResponse> {
        return this.put(`${this.endpoint}/${productId}`, payload)
    }

    async searchProduct(query: string): Promise<APIResponse> {
        return this.get(`${this.endpoint}/search`, {q:query})
    }
      async getNextPage(limit: number, skip: number): Promise<APIResponse> {
        return this.get(`${this.endpoint}`, {limit, skip})
    }

}