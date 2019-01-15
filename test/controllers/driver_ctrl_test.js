const request = require('supertest');
const assert = require('assert');
const app = require('../../app');

describe('Create Driver Test', () => {
  it('Post to /api/drivers', done => {
    request(app)
      .post('/api/drivers')
      .send({ email: 'test@test.com' })
      .end((err,res)=>{
        done();
      });
  });
});
