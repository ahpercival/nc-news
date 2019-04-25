process.env.NODE_ENV = 'test';

const { expect } = require('chai');
const supertest = require('supertest');

const app = require('../app');
const connection = require('../db/connection');

const request = supertest(app);

describe.only('/', () => {
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());

  describe('/api', () => {
    it('GET status:200', () => {
      return request
        .get('/api')
        .expect(200)
        .then(({ body }) => {
          expect(body.ok).to.equal(true);
        });
    });

    describe('GET /api/topics', () => {
      it('GET - Status 200', () => {
        const response = {
          topics: [
            { description: 'The man, the Mitch, the legend', slug: 'mitch' },
            { description: 'Not dogs', slug: 'cats' },
            { description: 'what books are made of', slug: 'paper' }
          ]
        }
        return request
          .get('/api/topics')
          .expect(200)
          .then(({ body }) => {
            expect(body).to.eql(response);
          });
      });
    });

  });
});
