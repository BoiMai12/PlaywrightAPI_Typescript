import { APIResponse } from "@playwright/test";
import { BaseClient } from "./base.client";
import { CreateUserRequest, UserResponse } from "../models/user.model";


export class UserClient extends BaseClient {
    private readonly endpoint = '/users';

    async createUser(payload: CreateUserRequest): Promise<APIResponse> {
        return this.post(`${this.endpoint}/add`, payload)
    }

    async getSingleUsers(userId: number): Promise<APIResponse> {
        return this.get(`${this.endpoint}/${userId}`)
    }

    async updateUser(userId: string, payload: CreateUserRequest): Promise<APIResponse> {
        return this.put(`${this.endpoint}/${userId}`, payload)
    }

    async deleteUser(userId: string): Promise<APIResponse> {
        return this.delete(`${this.endpoint}/${userId}`)
    }
    //========Utils =========

    buildPayLoad(overrides: Partial<CreateUserRequest> = {}): CreateUserRequest {
        const timestamp = Date.now();

        return {
            firstName: 'Nacy',
            lastName: 'Johnson',
            age: 30,
            email: `nacy.johnson.${timestamp}@example.com`,
            phone: '+1234567891',
            username: `nacy_${timestamp}`,
            password: 'Password456!',
            gender: 'female',
            ...overrides
        };
    }
    async createAndGetId(overrides: Partial<CreateUserRequest> = {}): Promise<number> {
        const res = await this.createUser(this.buildPayLoad(overrides));
        if (res.status() !== 201) {
            throw new Error(
                `Failed to create user. Status: ${res.status()}`
            );
        }
        const body = (await res.json()) as UserResponse
        if (typeof body.id !== 'number' || body.id <= 0) {
            throw new Error(`Invalid user ID: ${body.id}`);
        }
        return body.id
    }

}