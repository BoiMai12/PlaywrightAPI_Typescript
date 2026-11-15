import { APIRequestContext, APIResponse  } from "@playwright/test";
import type { createTokenManager } from '../helpers/token.managers';


type TokenManager = ReturnType<typeof createTokenManager>;
type QueryParams = Record<string, string | number | boolean>;

export class BaseClient{
    constructor(
        protected request: APIRequestContext,
        protected tokenManager?: TokenManager
    ){}
    private async getHeades(
        customHeaders: Record<string, string> = {}
    ): Promise<Record<string,string>>{
        if(!this.tokenManager){
            return customHeaders
        }
        const token = await this.tokenManager.getValidToken();
        return{
            Authorization: `Bearer ${token}`,
            ...customHeaders,
        }
    }

    protected async get(
        url:string, 
        params?: QueryParams,
        headers?: Record<string, string>
    ){
        return this.request.get(url, {
            params,
            headers: await this.getHeades(headers)
        });
    }

    protected async post<T>(url: string, data?:T, headers?: Record<string, string>){
        return this.request.post(url, {data,
            headers: await this.getHeades(headers)
        });
    }

    protected async put<T>(url: string, data?:T, headers?: Record<string, string>){
        return this.request.put(url, {data,
            headers: await this.getHeades(headers)
        })
    }

      protected async delete<T>(url: string,
            headers?: Record<string, string>

      ){
        return this.request.delete(url,{
            headers: await this.getHeades(headers)
        }

        )
    }
}