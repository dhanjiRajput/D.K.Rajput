const EventEmitter = require('events');

// Create instance
const shopEmitter = new EventEmitter();

// Listener 1: Send email
shopEmitter.on('order-placed', (order) => {
  console.log(`📧 Email sent to ${order.email} for order ${order.id}`);
});

// Listener 2: Reduce stock
shopEmitter.on('order-placed', (order) => {
  console.log(`📦 Stock reduced for product ${order.product}`);
});

// Listener 3: Generate invoice
shopEmitter.on('order-placed', (order) => {
  console.log(`🧾 Invoice generated for order ${order.id}`);
});

// Listener 4: Notify admin
shopEmitter.on('order-placed', (order) => {
  console.log(`🔔 Admin notified about order ${order.id}`);
});

// Simulate placing an order
const order = {
  id: "ORD123",
  email: "customer@example.com",
  product: "Laptop",
  quantity: 1,
};

shopEmitter.emit('order-placed', order);
