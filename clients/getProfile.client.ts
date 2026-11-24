import { APIResponse } from "@playwright/test";
import { BaseClient, RequestOptions } from "./base.client";


export class GetProfileClient extends BaseClient {
    private readonly endpoint = '/auth/me';

    async getProfile(options?: RequestOptions): Promise<APIResponse> {
        return this.get(this.endpoint, undefined, options);
    }

    async getProfileWithoutToken(): Promise<APIResponse>{
        return this.getProfile({auth:{type: 'none'}})
    }
      async getProfileInvalidToken(token:string): Promise<APIResponse>{
        return this.getProfile({auth:{type: 'custom', token}})
    }
}
