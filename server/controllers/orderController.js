import mongoose from 'mongoose';
import { Order } from '../models/Order.js';
import { Restaurant } from '../models/Restaurant.js';
import { eventBus } from '../sse/eventBus.js';

// Memory cache for fallback
const MOCK_ORDERS = new Map();

export const createOrder = async (req, res) => {
  try {
    const {
      restaurantId,
      items,
      deliveryAddress,
      paymentMethod,
      subtotal,
      deliveryFee,
      tax,
      discount,
      total
    } = req.body;

    const customerId = req.user.id;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Cart items are required' });
    }

    // Auto generate FT-XXXX order number
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `FT-${randomNum}`;

    let orderData = {
      orderNumber,
      customerId,
      restaurantId: restaurantId || 'rest_001',
      items: items.map((i) => ({
        dishId: i.dish?._id || i.dishId || 'dish_101',
        name: i.dish?.name || i.name,
        price: i.dish?.price || i.price,
        quantity: i.quantity,
        selectedAddOns: i.selectedAddOns || [],
        specialInstructions: i.specialInstructions || ''
      })),
      status: 'fired',
      placedAt: new Date(),
      deliveryAddress: deliveryAddress || '123 Prep St, Unit 4',
      paymentMethod: paymentMethod || 'card',
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
      subtotal: subtotal || 0,
      deliveryFee: deliveryFee || 0,
      tax: tax || 0,
      discount: discount || 0,
      total: total || 0,
      riderInfo: {
        name: 'Rider Alex',
        phone: '555-0199',
        vehicle: 'Red Scooter (Plate: FT-88)'
      }
    };

    let savedOrder = null;
    if (mongoose.connection.readyState === 1) {
      try {
        const orderDoc = new Order(orderData);
        savedOrder = await orderDoc.save();
        orderData._id = savedOrder._id;
      } catch (dbErr) {
        console.warn('MongoDB order save failed, storing in memory fallback');
        orderData._id = `ord_${Date.now()}`;
      }
    } else {
      orderData._id = `ord_${Date.now()}`;
    }

    MOCK_ORDERS.set(orderData._id.toString(), orderData);
    MOCK_ORDERS.set(orderNumber, orderData);

    // Emit real-time SSE event order:created
    eventBus.emitEvent('order:created', orderData);

    res.status(201).json({
      message: 'Order created successfully',
      order: savedOrder || orderData
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    let order = null;

    if (mongoose.connection.readyState === 1 && !id.startsWith('ord_') && !id.startsWith('FT-')) {
      try {
        order = await Order.findById(id).populate('restaurantId customerId').maxTimeMS(800).lean();
      } catch (e) {}
    }

    if (!order) {
      order = MOCK_ORDERS.get(id) || null;
    }

    if (!order) {
      return res.status(404).json({ message: 'Order ticket not found' });
    }

    res.json({ order });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Error fetching order', error: error.message });
  }
};

export const getCustomerOrders = async (req, res) => {
  try {
    const customerId = req.user.id;
    let orders = [];

    if (mongoose.connection.readyState === 1) {
      try {
        orders = await Order.find({ customerId }).sort({ createdAt: -1 }).populate('restaurantId').maxTimeMS(800).lean();
      } catch (e) {}
    }

    if (!orders || orders.length === 0) {
      orders = Array.from(MOCK_ORDERS.values()).filter(
        (o) => o.customerId === customerId || o.customerId === req.user.id
      );
    }

    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customer orders', error: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['fired', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid order status' });
    }

    let order = null;
    if (mongoose.connection.readyState === 1 && !id.startsWith('ord_') && !id.startsWith('FT-')) {
      try {
        order = await Order.findByIdAndUpdate(id, { status }, { new: true }).maxTimeMS(800).lean();
      } catch (e) {}
    }

    if (!order && MOCK_ORDERS.has(id)) {
      order = MOCK_ORDERS.get(id);
      order.status = status;
      MOCK_ORDERS.set(id, order);
    }

    if (order) {
      eventBus.emitEvent('order:statusChanged', {
        orderId: order._id || id,
        orderNumber: order.orderNumber,
        status: status,
        customerId: order.customerId
      });
    }

    res.json({ message: 'Order status updated', order });
  } catch (error) {
    res.status(500).json({ message: 'Error updating order status', error: error.message });
  }
};
