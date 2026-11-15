import { test as base } from '@playwright/test';
import { UserClient } from '../clients/user.client';

type ApiFixture = {
    userClient: UserClient
}

export const test = base.extend<ApiFixture>({
    userClient: async({request}, use) =>{
        await use(new UserClient(request));
    }
})