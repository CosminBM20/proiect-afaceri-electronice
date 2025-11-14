const { sequelize } = require('../server');
const { DataTypes } = require('sequelize');
const User = require('./User');
const Product = require('./Product');

const Cart = sequelize.define('Cart', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    allowNull: false,
  }
}, {
  tableName: 'cart',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

// RELATIONS
Cart.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Cart, { foreignKey: 'userId' });

Cart.belongsTo(Product, { foreignKey: 'productId' });
Product.hasMany(Cart, { foreignKey: 'productId' });

module.exports = Cart;
