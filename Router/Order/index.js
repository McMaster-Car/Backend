const express = require('express');
const OrderRouter = express.Router();
const orderService = require('../../Services/orderService');

// Create a new order
OrderRouter.post('/createOrder', async (req, res) => {
  try {
    const order = await orderService.createOrder(req.body);
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all orders
OrderRouter.get('/getAllOrders', async (req, res) => {
  try {
    const orders = await orderService.getAllOrders();
    res.status(200).json(orders);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get an order by ID
OrderRouter.get('/getOneOrder/:id', async (req, res) => {
  try {
    const order = await orderService.getOrderById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.status(200).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update order delivery status
OrderRouter.patch('/delivered/:id', async (req, res) => {
  try {
    const order = await orderService.updateOrderStatus(req.params.id);
    res.status(200).json(order);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete an order
OrderRouter.delete('/deleteOrder/:id', async (req, res) => {
  try {
    await orderService.deleteOrder(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = OrderRouter;
