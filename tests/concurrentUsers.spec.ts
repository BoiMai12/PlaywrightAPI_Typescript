import { test, expect } from "@playwright/test";
import { getUserIds, getUserIdsSettled } from '../helpers/getusers_Promise.helper'

// only verify for passes cases
test(`API-01current user request`, async ({ request }) => {
    const userIds = [1, 2, 5];
    await Promise.all(
        userIds.map(async (id) => {
            const response = await request.get(`/users/${id}`);
            expect(response.status()).toBe(200);
            console.log(`get userid ${id}`);
            const body = await response.json();
            expect(body.id).toEqual(id);
        })
    )
})
// best approach for Playwright automation
test(`API-02 Concurrent get users - using driven data`, async ({ request }) => {
    const testcases = [
        { userId: 1, expectedStatus: 200 },
        { userId: 2, expectedStatus: 200 },
        { userId: 9999, expectedStatus: 404 },
    ]
    await Promise.all(
        testcases.map(async ({ userId, expectedStatus }) => {
            const response = await request.get(`/users/${userId}`);
            console.log(`Driven data - userid ${userId}`);
            expect(response.status()).toBe(expectedStatus);
            const body = await response.json();
            if (response.status() === 200) {
                expect(body.id).toEqual(userId);

            }
            if (response.status() === 404) {
                expect(typeof body.message).toBe('string');
                expect(body.message.trim().length).toBeGreaterThan(0);

            }
        })
    )
})

/// Try to use helper Promise 
//purpose understand the Promise.all and Promise.allSettled


test(`Get multiple users`, async ({ request }) => {
    const expectedIds = [1, 3, 4]
    const acutalIds = await getUserIds(request, expectedIds);
    console.log(`Using promise.all for userId`,acutalIds)

    expect(acutalIds).toEqual(expectedIds)
})

test(`Get multiple users using allSettled`, async ({ request }) => {
    const userIds = [1, 3, 9999]
    const results = await getUserIdsSettled(request, userIds);
    const rejectUsers = results.map((result, index) => ({
        result,
        userId: userIds[index]
    })).filter(item => item.result.status === 'rejected');
    for (const item of rejectUsers) {
        const response = await request.get(`/users/${item.userId}`);
        console.log(`Using promise.allSettled for userId ${item.userId}`)
        const body = await response.json()
        expect(response.status()).toBe(404)
        expect(body.message.trim().length).toBeGreaterThan(0)

    }

})