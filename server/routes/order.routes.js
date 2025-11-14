const express = require('express');
const { verifyToken } = require('../utils/token');
const { Cart, Order, OrderItem, Product, User } = require('../database/models');

const router = express.Router();

/* ===========================================================
   PLACE ORDER (POST /orders/place)
   =========================================================== */
router.post('/place', verifyToken, async (req, res) => {
  try {
    const userId = req.userId;

    const cartItems = await Cart.findAll({
      where: { userId },
      include: [{ model: Product }]
    });

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    const getPrice = (item) => {
      try {
        return item.Product?.price || item.Product?.dataValues?.price;
      } catch {
        return null;
      }
    };

    let total = 0;
    for (const item of cartItems) {
      const price = getPrice(item);
      if (!price) {
        return res.status(500).json({
          success: false,
          message: `Price not found for productId=${item.productId}`
        });
      }
      total += item.quantity * price;
    }

    const order = await Order.create({
      userId,
      totalPrice: total,
      status: "Pending"
    });

    for (const item of cartItems) {
      const price = getPrice(item);

      await OrderItem.create({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        priceAtPurchase: price
      });
    }

    await Cart.destroy({ where: { userId } });

    res.json({
      success: true,
      message: "Order placed successfully",
      orderId: order.id
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      stack: error.stack
    });
  }
});


router.get('/', verifyToken, async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: OrderItem,
          include: [{ model: Product }]   
        },
        {
          model: User,
          attributes: ['id', 'name', 'email'] 
        }
      ],
      order: [['created_at', 'DESC']]
    });

    res.json({ success: true, data: orders });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
router.put('/:id/status', verifyToken, async (req, res) => {
  try {
    const { status } = req.body;

    if (!['Pending', 'Processing', 'Completed'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.status = status;
    await order.save();

    res.json({ success: true, message: 'Order status updated', order });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
router.get('/my', verifyToken, async (req, res) => {
  try {
    const userId = req.userId;

    const orders = await Order.findAll({
      where: { userId },
      include: [
        {
          model: OrderItem,
          include: [{ model: Product }]
        }
      ],
      order: [['created_at', 'DESC']]
    });

    res.json({ success: true, data: orders });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


module.exports = router;
