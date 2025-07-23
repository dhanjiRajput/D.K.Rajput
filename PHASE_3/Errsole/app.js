const express = require('express');
const errsoleModule = require('errsole');

const app = express();
app.use(express.json());

// ✅ Check if middleware is valid before using
if (typeof errsoleModule.expressErrorHandler === 'function') {
  app.use(errsoleModule.expressErrorHandler);
} else {
  console.warn('⚠️ errsole.expressErrorHandler is not a function — skipping');
}

app.get('/', (req, res) => {
  res.send('✅ Welcome to Errsole demo for Node.js v22.15.0');
});

app.get('/error', (req, res) => {
  throw new Error('💥 Intentional crash!');
});

app.listen(3000, () => {
  console.log('🚀 App running on http://localhost:3000');
  console.log('🔍 Trigger error at http://localhost:3000/error');
  console.log('📊 View Errsole at http://localhost:3000/errsole');
});

// Errsole, a developer tool designed to make debugging Node.js applications easier and more visual.

/*❌ Errsole is officially not compatible with Node.js v22+
Why?
Errsole relies on internal Node.js APIs and stack inspection techniques that broke in Node v20+

It has not been updated to work with Node.js v22.15.0

The library is now effectively deprecated unless maintained further*/