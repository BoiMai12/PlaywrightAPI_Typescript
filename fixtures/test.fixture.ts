import { mergeTests, expect } from '@playwright/test';
import { test as apiTest } from './api.fixture';
import { test as authTest } from './auth.worker.fixture';

export const test = mergeTests(apiTest, authTest);

export { expect };