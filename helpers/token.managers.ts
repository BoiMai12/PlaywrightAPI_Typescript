import type { APIRequestContext } from "@playwright/test";
import { loginAndGetToken } from "./auth.helper";
import { Buffer } from "node:buffer";


export function isTokenExpired(token: string): boolean {
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

export function createTokenManager(request: APIRequestContext) {
    let cachedToken: string | undefined;

    function clearTokenCached(): void {
        cachedToken = undefined;
    }

    function setCachedToken(token: string): void {
        cachedToken = token;
    }

    async function getValidToken(): Promise<string> {
        if (!cachedToken || isTokenExpired(cachedToken)) {
            cachedToken = await loginAndGetToken(request)
        }
        return cachedToken;
    }
    return{
        getValidToken,
        clearTokenCached,
        setCachedToken,
        isTokenExpired
    }
}

