'use strict';

/** @type {import('sequelize-cli').Migration} */
const { Booking } = require('../models');
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA; // define your schema in options object
}
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await Booking.bulkCreate([
      {
        spotId: 1,
        userId: 1,
        startDate: '2000-01-01',
        endDate: '2000-01-10'
      },
      {
        spotId: 2,
        userId: 1,
        startDate: '2000-03-01',
        endDate: '2000-03-10'
      },
      {
        spotId: 3,
        userId: 1,
        startDate: '2000-04-01',
        endDate: '2000-04-10'
      }
    ], {validate: true});
  },


  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3]}
    }, {});
  }
};
