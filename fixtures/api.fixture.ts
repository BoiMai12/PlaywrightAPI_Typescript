import { test as base } from '@playwright/test';
import { UserClient } from '../clients/user.client';
import { ProductClient } from '../clients/product.client';

type ApiFixture = {
    userClient: UserClient,
    productClient: ProductClient
}

export const test = base.extend<ApiFixture>({
    userClient: async({request}, use) =>{
        await use(new UserClient(request));
    },
    productClient: async({request}, use) =>{
        await use(new ProductClient(request));
    }
})

