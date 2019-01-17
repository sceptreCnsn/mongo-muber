const request = require('supertest');
const assert = require('assert');
const mongoose = require('mongoose');
const app = require('../../app');
const Driver = mongoose.model('driver');

describe('Drivers Controller', () => {
  it('Post to /api/drivers', done => {
    Driver.countDocuments().then(count => {
      request(app)
        .post('/api/drivers')
        .send({ email: 'test@test.com' })
        .end((err, res) => {
          console.log('Driver Post Response: ', res.body);
          Driver.countDocuments().then(newCount => {
            assert(count + 1 === newCount);
          });
          done();
        });
    });
  });

  it('Puts to /api/drivers', done => {
    const driver = new Driver({ email: 'cansin@test.com', driving: false });
    driver.save().then(rec => {
      console.log('Created Driver: ', rec);
      rec.driving = true;
      request(app)
        .put(`/api/drivers/${driver._id}`)
        .send({ driving: true })
        .end((err, res) => {
          console.log('Driver Put Response: ', res.body);
          assert(res.body.driving);
        });
    });
    done();
  });

  it('Deletes from /api/drivers', done => {
    const driver = new Driver({ email: 'cansin2@test.com', driving: false });
    driver.save().then(rec => {
      request(app)
        .delete(`/api/drivers/${driver._id}`)
        .end((err, res) => {
          assert(res.body._id.toString() === driver._id.toString());
          done();
        });
    });
  });

  it('get to /api/drivers finds drivers in a location', done => {
    const seattleDriver = new Driver({
      email: 'seattle@test.com',
      geometry: { type: 'Point', coordinates: [-122.4759902, 47.6147628] }
    });
    const miamiDriver = new Driver({
      email: 'miami@test.com',
      geometry: { type: 'Point', coordinates: [-80.253, 25.791] }
    });

    Promise.all([seattleDriver.save(), miamiDriver.save()]).then(() => {
      request(app).get('/api/drivers?lng=-80&lat=25').end((err,res)=>{
        console.log('List of Drivers: ',res.body);
        assert(res.body.length>0);
        done();
      });
    });
  });
});
