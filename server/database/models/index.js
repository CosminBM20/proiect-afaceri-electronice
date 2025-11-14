const User = require('./User');
const Product = require('./Product');
const Cart = require('./Cart');
const Order = require('./Order')
const OrderItem = require('./OrderItem')

// Associations
User.hasMany(Cart, { foreignKey: 'userId', onDelete: 'CASCADE' });
Product.hasMany(Cart, { foreignKey: 'productId', onDelete: 'CASCADE' });

module.exports = { User, Product, Cart, Order, OrderItem};
