const { sequelize } = require('../server')
const { DataTypes } = require('sequelize')
const Order = require('./Order')
const Product = require('./Product')

const OrderItem = sequelize.define('OrderItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  priceAtPurchase: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
}, {
  tableName: 'order_items',
  timestamps: false
})

OrderItem.belongsTo(Order, { foreignKey: 'orderId' })
Order.hasMany(OrderItem, { foreignKey: 'orderId' })

OrderItem.belongsTo(Product, { foreignKey: 'productId' })

module.exports = OrderItem
