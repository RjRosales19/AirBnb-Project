'use strict';

/** @type {import('sequelize-cli').Migration} */

const { Review } = require('../models');
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
    await Review.bulkCreate([
      {
        spotId: 1,
        userId: 1,
        review: 'Very Spacious and good big families',
        stars: 4,
      },
      {
        spotId: 2,
        userId: 2,
        review: 'Was not expecting to have really loud neighbors',
        stars: 2,
      },
      {
        spotId: 3,
        userId: 3,
        review: 'The view and design are impeccable, really love it out here',
        stars: 5,
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
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1, 2, 3]}
    }, {});
  }
};
