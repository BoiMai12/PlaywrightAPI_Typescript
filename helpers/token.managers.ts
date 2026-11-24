import type { APIRequestContext } from "@playwright/test";
import { loginAndGetToken } from "./auth.helper";


export class TokenManager {
    private cachedToken?: string | undefined
    constructor(private readonly request: APIRequestContext) { }

    static isTokenExpired(token: string): boolean {
        try {
            const payload = JSON.parse(
                Buffer.from(token.split('.')[1], 'base64url').toString('utf8')
            );

            const currentTime = Math.floor(Date.now() / 1000);

            return (
                typeof payload.exp !== 'number' ||
                currentTime >= payload.exp - 30
            );
        } catch {
            return true;
        }
    }

    clearTokenCached(): void {
        this.cachedToken = undefined;
    }

    setCachedToken(token: string): void {
        this.cachedToken = token;
    }

    async  getValidToken(): Promise<string> {
        if (!this.cachedToken || TokenManager.isTokenExpired(this.cachedToken)) {
            this.cachedToken = await loginAndGetToken(this.request)
        }
        return this.cachedToken;
    }

}



