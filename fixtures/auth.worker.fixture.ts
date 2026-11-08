import { loginAndGetToken } from '../helpers/auth.helper';
import {test as base, expect, request} from '@playwright/test';
import { createTokenManager } from '../helpers/token.managers';

type workerFixture = {
    tokenManager: ReturnType<typeof createTokenManager>;

}

export const test = base.extend<{}, workerFixture>({
    tokenManager: [
        async({}, use) => {
            const apiContext = await request.newContext({
                baseURL: process.env.API_BASE_URL
            });
            try {
                const tokenManager = createTokenManager(apiContext)
                await use(tokenManager)
            }
            finally{
                await apiContext.dispose();
            }
        },
        {scope: 'worker'}
    ]
})
export {expect};