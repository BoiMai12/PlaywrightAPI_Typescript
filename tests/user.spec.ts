import { test, expect } from '../fixtures/test.fixture';
test('API-01 Get user by ID', async ({ userClient }) => {

    const res = await userClient.getSingleUsers(1);
    console.log('Request URL:', res.url());
    // console.log('Request Method:', res.request().method());
    console.log('Response Status:', res.status());
    console.log('Response Body:', await res.text());
    expect(res.status()).toBe(200);

    const body = await res.json();

    expect(body.id).toBe(1);
    expect(body.firstName).toEqual(expect.any(String));
});