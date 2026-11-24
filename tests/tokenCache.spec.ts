import { test, expect } from '../fixtures/api.fixture';
import { TokenManager } from '../helpers/token.managers';

test.describe(`Check token management`, async() => {

test(`API-01 test token`, { tag: ['@smoke', '@regression'] }, async ({ tokenManager }) => {
    const token = await tokenManager.getValidToken();
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    expect(token.trim().length).toBeGreaterThan(0)

})


test(`API-02 Reuse token`, { tag: '@regression' }, async ({ tokenManager }) => {
    tokenManager.clearTokenCached()
    const token1 = await tokenManager.getValidToken();
    const token2 = await tokenManager.getValidToken();
    expect(token1).toEqual(token2);


})

test(`API-03 Verified expired token`, { tag: ['@regression', '@e2e'] }, async ({ tokenManager, getProfileClient }) => {
    tokenManager.clearTokenCached()
    const expiredPayLoad = {
        exp: Math.floor(Date.now() / 1000) - 3600
    }
    const expiredToken = [
        Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url'),
        Buffer.from(JSON.stringify(expiredPayLoad)).toString('base64url'),
        'fake-signature'
    ].join('.');

    expect(TokenManager.isTokenExpired(expiredToken)).toBe(true)

    // Put the expired token in the cache so getValidToken() has to refresh it
    tokenManager.setCachedToken(expiredToken);
    const newToken = await tokenManager.getValidToken();

    expect(newToken).toBeDefined();
    expect(typeof newToken).toBe('string');
    expect(newToken).not.toBe(expiredToken);
    expect(TokenManager.isTokenExpired(newToken)).toBe(false);

    const res = await getProfileClient.getProfile()
    expect(res.status()).toBe(200);

})

test(`API-04 User token to get user`, { tag: ['@regression', '@e2e'] }, async ({ tokenManager, getProfileClient }) => {
    tokenManager.clearTokenCached()
    const token = await tokenManager.getValidToken();
    const response = await getProfileClient.getProfile();
    expect(response.status()).toBe(200);
    const body = await response.json();
    console.log(`body: ${body}`)
    expect(body).toMatchObject(
        {
            username: 'emilys',
            id: expect.any(Number)
        }
    )

})
})
