const Driver = require('../models/driver');
module.exports = {
  greeting(req, res) {
    res.send({ hi: 'there' });
  },

  index(req, res, next) {
    const { lng, lat } = req.query;
    //Finds drivers with max distance of 200000 meters
    //Not supported in Mongo Latest
    Driver.geoNear(
      { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
      { spherical: true, maxDistance: 200000 }
    )
      .then(drivers => {
        res.send(drivers);
      })
      .catch(next);
  },

  create(req, res, next) {
    const driverProps = req.body;
    Driver.create(driverProps)
      .then(driver => {
        res.send(driver);
      })
      .catch(next);
  },

  edit(req, res, next) {
    const driverId = req.params.id;
    console.log('Put Request Body: ', req.body);
    console.log('Driver ID: ', driverId);
    Driver.findByIdAndUpdate({ _id: driverId }, req.body)
      .then(() => {
        Driver.findById({ _id: driverId }).then(driver => {
          console.log('Driver put Response: ', driver);
          res.send(driver);
        });
      })
      .catch(next);
  },

  delete(req, res, next) {
    const driverId = req.params.id;
    console.log('Driver Id', driverId);
    Driver.findByIdAndRemove({ _id: driverId })
      .then(driver => {
        console.log('Removed Driver: ', driver);
        res.send(driver);
      })
      .catch(next);
  }
};
