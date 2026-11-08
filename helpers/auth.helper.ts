import type { APIRequestContext } from "@playwright/test";

type LoginResponse = {
    accessToken: string,
    refreshToken: string
}

export async function loginAndGetToken(request: APIRequestContext): Promise<string>{
    const response = await request.post('/auth/login', {
        data:{
            username: 'emilys',
            password: 'emilyspass'
        }
    })
    if(response.status() !== 200){
        throw new Error(`Login failed: ${response.status()}`)
    }
    const body : LoginResponse = await response.json();
    if(typeof body.accessToken !== 'string' || !body.accessToken ){
        throw new Error("Access Token is missing or invalid")
    }
    return body.accessToken
}