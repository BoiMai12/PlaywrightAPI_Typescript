import { APIRequestContext, APIResponse  } from "@playwright/test";
import type { TokenManager } from '../helpers/token.managers';



export type AuthMode =
    | { type: 'default' }            // use TokenManager token
    | { type: 'none' }               // send no Authorization header
    | { type: 'custom'; token: string }; // send whatever token you want (invalid/expired)

export interface RequestOptions {
    auth?: AuthMode;
    headers?: Record<string, string>;
}

type QueryParams = Record<string, string | number | boolean>;

export class BaseClient{
    constructor(
        protected readonly request: APIRequestContext,
        protected readonly tokenManager: TokenManager,
    ) {}
    protected async buildHeaders(
        options: RequestOptions = {}
    ): Promise<Record<string,string>>{
        const auth = options.auth ?? {type: 'default'};
        const headers: Record<string, string> = { ...options.headers };
        if(auth.type === 'default'){
            headers['Authorization'] = `Bearer ${await this.tokenManager.getValidToken()}`;
        } else if (auth.type === 'custom'){
            headers['Authorization'] = `Bearer ${auth.token}`
        }
        return headers;
 
    }

    protected async get(
        url:string, 
        params?: QueryParams,
        options?: RequestOptions
    ){
        return this.request.get(url, {
            params,
            headers: await this.buildHeaders(options)
        });
    }

    protected async post<T>(url: string, data?:T, options?: RequestOptions){
        return this.request.post(url, {data,
            headers: await this.buildHeaders(options)
        });
    }

    protected async put<T>(url: string, data?:T, options?: RequestOptions){
        return this.request.put(url, {data,
            headers: await this.buildHeaders(options)
        })
    }

      protected async delete<T>(url: string,
            options?: RequestOptions

      ){
        return this.request.delete(url,{
            headers: await this.buildHeaders(options)
        }

        )
    }
}