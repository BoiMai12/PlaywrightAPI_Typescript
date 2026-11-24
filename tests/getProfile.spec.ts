import { GetProfileClient } from '../clients/getProfile.client';
import { test, expect } from '../fixtures/api.fixture';

test.describe(`Get /auth/me`, () =>{
test(`Get profile to check user information`, async ({getProfileClient}) =>{
    const res = await getProfileClient.getProfile();
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.username).toEqual('emilys');
    expect(body.id).toBe(1);

})

test('Get profile with no token', async({getProfileClient}) => {
    const res = await getProfileClient.getProfileWithoutToken();
    expect(res.status()).toBe(401);
    const body = await res.json();
    expect(body).toHaveProperty('message');
    expect(body).not.toHaveProperty('id');

})

test('Get profile with invalid token', async({getProfileClient}) => {
    const res = await getProfileClient.getProfileInvalidToken('invalidtoken7847');
    expect(res.status()).toBe(401);
    const body = await res.json();
    expect(body).toHaveProperty('message');
    
    expect(body).not.toHaveProperty('id');

})
})

