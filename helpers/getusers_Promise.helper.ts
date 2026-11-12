import { APIRequestContext } from "@playwright/test";


// promise.all - All must succeed
//Promise.all() does not cancel other requests when one fails. The remaining requests can continue running.
export async function getUserIds(
    request: APIRequestContext, 
    ids: number[])
    : Promise<number[]> {
    const results = await Promise.all(
        ids.map(async (id) => {
            const response = await request.get(`/users/${id}`)
            if (!response.ok()) {
                throw new Error(`Failed to get user ${id}`)
            }
            const body = await response.json();
            return body.id as number
        })
    )
    return results;

}

export async function getUserIdsSettled(
    request: APIRequestContext,
    ids: number[]
): Promise<PromiseSettledResult<number>[]> {
    const results = await Promise.allSettled(
        ids.map(async (id) => {
            const response = await request.get(`/users/${id}`);

            if (!response.ok()) {
                throw new Error(`Get userId ${id} failed `);

            }
            const body = await response.json();
            return body.id as number;
        })
    )
    return results
}
