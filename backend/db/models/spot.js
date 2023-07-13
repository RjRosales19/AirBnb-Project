'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Spot.hasMany(models.Booking,
        {
          foreignKey: 'spotId',
          onDelete: 'CASCADE',
          hooks:true
        });
      Spot.belongsTo(models.User,
        {
          foreignKey: 'ownerId',
          as: 'Owner',
        })

      Spot.hasMany(models.Review,
        {
          foreignKey: 'spotId',
          onDelete: 'CASCADE',
          hooks:true
        });

      Spot.hasMany(models.SpotImage,
        {
          foreignKey: 'spotId',
          hooks:true,
          onDelete: 'CASCADE'
        })
    }
  }
  Spot.init({
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull:false,
      autoIncrement:true,
      primaryKey: true
    },
    address: {
      type: DataTypes.STRING
    },
    city: {
      type: DataTypes.STRING
    },
    state: {
      type: DataTypes.STRING
    },
    country: {
      type: DataTypes.STRING
    },
    lat: {
      type: DataTypes.DECIMAL
    },
    lng: {
      type: DataTypes.DECIMAL
    },
    name: {
      type: DataTypes.STRING
    },
    description: {
      type: DataTypes.STRING
    },
    price: {
      type: DataTypes.INTEGER
    },
    avgRating: {
      type: DataTypes.DECIMAL
    },
    previewImage: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};
