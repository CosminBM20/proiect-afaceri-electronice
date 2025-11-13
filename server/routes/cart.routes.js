const express = require('express');
const { Cart, Product } = require('../database/models');
const { verifyToken } = require('../utils/token');

const router = express.Router();

/**
 * GET /cart – toate produsele din coșul userului
 */
router.get('/', verifyToken, async (req, res) => {
  try {
    const items = await Cart.findAll({
      where: { userId: req.userId },
      include: [{ model: Product }]
    });

    res.status(200).json({ success: true, data: items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * POST /cart – adaugă produs în coș
 */
router.post('/', verifyToken, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    const existingItem = await Cart.findOne({
      where: { userId: req.userId, productId }
    });

    if (existingItem) {
      existingItem.quantity += quantity || 1;
      await existingItem.save();
      return res.json({ success: true, message: "Updated quantity", data: existingItem });
    }

    const newItem = await Cart.create({
      userId: req.userId,
      productId,
      quantity: quantity || 1
    });

    res.json({ success: true, message: "Added to cart", data: newItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * PUT /cart/:id – actualizează cantitatea
 */
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const item = await Cart.findByPk(req.params.id);

    if (!item || item.userId !== req.userId) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }

    item.quantity = req.body.quantity;
    await item.save();

    res.json({ success: true, message: "Quantity updated", data: item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * DELETE /cart/:id – elimină produs din coș
 */
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const item = await Cart.findByPk(req.params.id);

    if (!item || item.userId !== req.userId) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }

    await item.destroy();

    res.json({ success: true, message: "Item removed" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
