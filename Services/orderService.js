const Order = require('../Model/Order');
const Product = require('../Model/Products');
const Variation = require('../Model/Variations');

// Create a new order
async function createOrder(orderData) {
  const { name, address, products } = orderData;
  let totalPrice = 0;

  for (const product of products) {
      const variation = await Variation.findById(product.variationId);
      if (!variation) {
          throw new Error('Invalid variation ID');
      }

      // Check if stockQuantity is zero
      if (variation.stockQuantity === 0) {
          // Find the "Pkg Qty" attribute
          const pkgQtyAttribute = variation.attributes.find(attr => 
              attr.attributeId.toString() === "66af8d46db18ba6ac3387f92"
          );

          if (pkgQtyAttribute && pkgQtyAttribute.value) {
              const pkgQty = parseInt(pkgQtyAttribute.value.trim());

              // Check if package quantity is sufficient
              if (pkgQty >= product.quantity) {
                  variation.stockQuantity = pkgQty - product.quantity;
              } else {
                  throw new Error('Insufficient stock for variation ID: ' + product.variationId);
              }
          } else {
              throw new Error('Pkg Qty attribute not found or invalid for variation ID: ' + product.variationId);
          }
      } else {
          // Subtract the stock quantity if stockQuantity is not zero
          if (variation.stockQuantity < product.quantity) {
              throw new Error('Insufficient stock for variation ID: ' + product.variationId);
          }
          variation.stockQuantity -= product.quantity;
      }

      await variation.save();

      // Accumulate the total price
      totalPrice += product.price * product.quantity;
  }

  const order = new Order({
      name,
      address,
      products,
      totalPrice,
  });

  return await order.save();
}




// Get all orders
async function getAllOrders() {
    try {
      const orders = await Order.find()
        .populate({
          path: 'products.productId',
          model: 'Product',
          select: '-attributes -categories -variations' // Exclude these fields
        })
        .populate({
          path: 'products.variationId',
          model: 'Variation',
          select: 'picture' // Only include picture
        });
      return orders;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }
  
  

// Get a single order by ID
async function getOrderById(orderId) {
  return await Order.findById(orderId).populate('products.productId').populate('products.variationId');
}

// Update order delivery status
async function updateOrderStatus(orderId, isDelivered) {
  const order = await Order.findById(orderId);
  if (!order) throw new Error('Order not found');

  order.isDelivered = true;
  return await order.save();
}

// Delete an order
async function deleteOrder(orderId) {
  return await Order.findByIdAndDelete(orderId);
}

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
};
