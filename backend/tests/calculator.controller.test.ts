import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../src/app';

const app = createApp();

const validCalculation = {
  productCost: 1000,
  shippingCost: 0,
  supplierPrice: 0,
  profitMargin: 30,
  dropiCommission: 0,
  estimatedCpa: 0,
  orderCount: 1,
};

const validScore = {
  wowEffect: true,
  catchyLaunch: true,
  highValuePerception: true,
  needsFulfilled: true,
  canImport: true,
};

describe('POST /api/calculator', () => {
  it('responde 200 con el resultado del cálculo', async () => {
    const response = await request(app).post('/api/calculator').send(validCalculation);

    expect(response.status).toBe(200);
    expect(response.body.idealSalePrice).toBe(1300);
    expect(response.body.profitPerSale).toBe(300);
    expect(response.body.totalProfit).toBe(300);
  });

  it('responde 400 con un payload inválido', async () => {
    const response = await request(app)
      .post('/api/calculator')
      .send({ productCost: -1, shippingCost: 0 });

    expect(response.status).toBe(400);
    expect(response.body.errors).toHaveProperty('productCost');
  });
});

describe('POST /api/calculator/score', () => {
  it('responde 200 con la puntuación del producto', async () => {
    const response = await request(app).post('/api/calculator/score').send(validScore);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ score: 5, maxScore: 5 });
  });

  it('responde 400 con un payload inválido', async () => {
    const response = await request(app)
      .post('/api/calculator/score')
      .send({ wowEffect: true });

    expect(response.status).toBe(400);
    expect(response.body.errors).toHaveProperty('canImport');
  });
});

describe('GET /health', () => {
  it('responde 200 con el estado del servicio', async () => {
    const response = await request(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });
});
