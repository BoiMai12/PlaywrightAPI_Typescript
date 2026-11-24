import { request } from '@playwright/test';
import { ProductClient } from '../clients/product.client';
import { test, expect } from '../fixtures/api.fixture';
import { CreateProductRequest } from '../models/product.model';

test.describe(`verify Product API /product`, async() => {
test(`Get product by Id`, async ({ productClient }) => {

    const res = await productClient.getProductById(1);

    expect(res.status()).toBe(200);

    const body = await res.json();

    expect(body.id).toBe(1);
    expect(body.title).toEqual(expect.any(String));
    expect(body.price).toEqual(expect.any(Number));
})

test(`Create product`, async ({ productClient }) => {
    const timestamp = Date.now();
    const payload: CreateProductRequest = {
        title: `Product_Title_${timestamp}`,
        description: `Product_description_${timestamp}`,
        price: 20,
        stock: 10,
        category: 'beauty'
    };
    const res = await productClient.addProduct(payload);
    expect(res.status()).toBe(201);
    const body = await res.json();

    expect(typeof body.id).toBe('number');
    expect(body.id).toBeGreaterThan(1);
    expect(body.title).toEqual(payload.title);
    expect(body.description).toEqual(payload.description);
    expect(body.price).toEqual(payload.price);
    expect(body.stock).toEqual(payload.stock);
    expect(body.category).toEqual(payload.category);

})

test(`Product: search project name`, async ({ productClient }) => {
    const searchKey = 'Lipstick'
    const res = await productClient.searchProduct(searchKey);
    expect(res.status()).toBe(200);
    const body = await res.json();

    // need to put it in the ultiliz class???
    const findProducts = body.products.filter((
        product: {title: string}) => 
        product.title.toLowerCase().includes(searchKey.toLowerCase()));

    console.log('findProducts', findProducts[0].title);    
    expect(findProducts.length).toBeGreaterThan(0);
    expect(findProducts[0].title.toLowerCase()).toContain(searchKey.toLowerCase());



})

test(`Product: Check list product in limit and skip`, async ({ productClient }) => {
    const res = await productClient.getNextPage(5, 10)
    console.log('Request URL:', res.url());
    expect(res.status()).toBe(200);
    const body = await res.json();
    const products = body.products;
    expect(products).toHaveLength(5);
        console.log('first product', products[0].id);

    expect(products[0].id).toBe(11);
    expect(products.at(-1).id).toBe(15);
    expect(body.skip).toBe(10);
    expect(body.limit).toBe(5);

})
})

