'use strict';
/** @type {import('sequelize-cli').Migration} */
const { Spot } = require('../models');
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
  await Spot.bulkCreate([
    {
      ownerId:1,
      address: '111 Benjamin Road',
      city:'Austin',
      state:'Texas',
      country:'United States of America',
      lat: 30.1295691,
      lng: -119.1231299,
      name: 'Korean BBQ',
      description: 'Place to enjoy KBBQ',
      price: 35
    },
    {
      ownerId:2,
      address: '777 Selasor Road',
      city:'Baltimore',
      state:'Maryland',
      country:'United States of America',
      lat: 70.5126591,
      lng: -200.3411299,
      name: 'Eternal',
      description: 'Place you can meditate in peace',
      price: 10
    },
    {
      ownerId:3,
      address: '1203 Kyle Road',
      city:'Orlando',
      state:'Florida',
      country:'United States of America',
      lat: 40.6183191,
      lng: -125.1123134,
      name: 'Sun Beach',
      description: 'Place to enjoy the beach',
      price: 20
    },
    // {
    //   ownerId:4,
    //   address: '132 Green Road',
    //   city:'Boston',
    //   state:'Vermont',
    //   country:'United States of America',
    //   lat: 32.6183191,
    //   lng: -100.1123134,
    //   name: 'Eternal Mountain',
    //   description: 'Place to enjoy the snowy weather',
    //   price: 100,
    //   avgRating: 2.5,
    //   previewImage: 'image url',
    // }
  ])
},

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['Sun Beach', 'Eternal', 'Korean BBQ']}
    }, {});
  }
};
