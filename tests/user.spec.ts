import { test, expect } from '../fixtures/api.fixture';
import { CreateUserRequest } from '../models/user.model'

test.describe(`Verify User API`, async () => {
    test('API-01 Get user by ID', {tag: '@regression'}, async ({ userClient }) => {

        const res = await userClient.getSingleUsers(1);
        console.log('Request URL:', res.url());
        // // console.log('Request Method:', res.request().method());
        // console.log('Response Status:', res.status());
        // console.log('Response Body:', await res.text());
        expect(res.status()).toBe(200);

        const body = await res.json();

        expect(body.id).toBe(1);
        expect(body.firstName).toEqual(expect.any(String));
    });

    test('API-02 Create a user',{tag: ['@regression', '@smoke']}, async ({ userClient }) => {
        const payload: CreateUserRequest = {
            firstName: 'CCung_1',
            lastName: 'Test',
            age: 30,
            gender: 'Female',
            email: 'test@gmail.com',
            phone: '83948738957',
            username: 'BOi_1',
            password: '343434',

        };
        const res = await userClient.createUser(payload);

        console.log('Request URL:', res.url());
        // // console.log('Request Method:', res.request().method());
        // console.log('Response Status:', res.status());
        // console.log('Response Body:', await res.text());
        expect(res.status()).toBe(201);

        const body = await res.json();
        expect(body.firstName).toEqual(payload.firstName);
    });

    test('API-03 Create a user and get Ids', {tag: '@regression'}, async ({ userClient }) => {
        const payload: CreateUserRequest = {
            firstName: 'CCung_1',
            lastName: 'Test',
            age: 30,
            gender: 'Female',
            email: 'test@gmail.com',
            phone: '83948738957',
            username: 'BOi_1',
            password: '343434',

        };
        const userId = await userClient.createAndGetId(payload);

        console.log('Created User ID:', userId);
        expect(userId).toEqual(expect.any(Number));
        expect(userId).toBeGreaterThan(0);
    })
})

