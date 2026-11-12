import { test, expect } from '../fixtures/auth.worker.fixture';
import { isTokenExpired } from '../helpers/token.managers';

test(`API-01 test token`, async ({ tokenManager }) => {
    const token = await tokenManager.getValidToken();
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    expect(token.trim().length).toBeGreaterThan(0)

})


test(`API-02 Reuse token`, async ({ tokenManager }) => {
    tokenManager.clearTokenCached()
    const token1 = await tokenManager.getValidToken();
    const token2 = await tokenManager.getValidToken();
    expect(token1).toEqual(token2);


})

test(`API-03 Verified expired token`, async ({ tokenManager, request }) => {
    tokenManager.clearTokenCached()
    const expiredPayLoad = {
        exp: Math.floor(Date.now() / 1000) - 3600
    }
    const expiredToken = [
        Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url'),
        Buffer.from(JSON.stringify(expiredPayLoad)).toString('base64url'),
        'fake-signature'
    ].join('.');

    expect(isTokenExpired(expiredToken)).toBe(true)

    const newToken = await tokenManager.getValidToken();

    expect(newToken).toBeDefined();
    expect(typeof newToken).toBe('string');
    expect(newToken).not.toBe(expiredToken);
    expect(isTokenExpired(newToken)).toBe(false);

    const response = await request.get('/auth/me', {
        headers: {
            Authorization: `Bearer ${newToken}`
        }
    })
    expect(response.status()).toBe(200);

})

test(`API-04 User token to get user`, async ({ tokenManager, request }) => {
    tokenManager.clearTokenCached()
    const token = await tokenManager.getValidToken();
    const response = await request.get('/auth/me', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
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