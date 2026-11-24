import { test as base, expect, request } from '@playwright/test';
import { TokenManager } from '../helpers/token.managers';
import { UserClient } from '../clients/user.client';
import { ProductClient } from '../clients/product.client';
import { GetProfileClient } from '../clients/getProfile.client';

type TestFixtures = {
    userClient: UserClient;
    productClient: ProductClient;
    getProfileClient: GetProfileClient;
};

type WorkerFixtures = {
    tokenManager: TokenManager;
};

export const test = base.extend<TestFixtures, WorkerFixtures>({
    // One TokenManager per worker: login once, reuse the cached token for every test/client in that worker.
    tokenManager: [
        async ({}, use) => {
            const apiContext = await request.newContext({
                baseURL: process.env.API_BASE_URL,
            });
            try {
                await use(new TokenManager(apiContext));
            } finally {
                await apiContext.dispose();
            }
        },
        { scope: 'worker' },
    ],

    // Clients: new instance per test, all sharing the worker's TokenManager.
    userClient: async ({ request, tokenManager }, use) => {
        await use(new UserClient(request, tokenManager));
    },
    productClient: async ({ request, tokenManager }, use) => {
        await use(new ProductClient(request, tokenManager));
    },
    getProfileClient: async ({ request, tokenManager }, use) => {
        await use(new GetProfileClient(request, tokenManager));
    },
});

export { expect };
