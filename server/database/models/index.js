const User = require('./User');
const Product = require('./Product');
const Cart = require('./Cart');

// Associations
User.hasMany(Cart, { foreignKey: 'userId', onDelete: 'CASCADE' });
Product.hasMany(Cart, { foreignKey: 'productId', onDelete: 'CASCADE' });

module.exports = { User, Product, Cart };
