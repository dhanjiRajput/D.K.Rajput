const EventEmitter = require('events');
const fs = require('fs');
const chatEmitter = new EventEmitter();


// 1. Save to database (simulated)
chatEmitter.on('message-sent', (msg) => {
  console.log(`📥 Message saved to DB: "${msg.text}" from ${msg.sender} to ${msg.receiver}`);
});

// 2. Notify receiver (simulated)
chatEmitter.on('message-sent', (msg) => {
  console.log(`🔔 Notification sent to ${msg.receiver}`);
});

// 3. Log to a file
chatEmitter.on('message-sent', (msg) => {
  const log = `[${new Date().toISOString()}] ${msg.sender} ➡ ${msg.receiver}: ${msg.text}\n`;
  fs.appendFileSync('chat.log', log);

  // Add separator with file last modified time
  const stats = fs.statSync('chat.log');
  const lastModified = stats.mtime.toISOString(); // Last modification time
  fs.appendFileSync('chat.log', `File last updated at: ${lastModified}\n---\n`);

  console.log('📝 Message logged with metadata');
});

// 4. Broadcast to chat room (e.g., via socket.io — simulated here)
chatEmitter.on('message-sent', (msg) => {
  console.log(`📡 Broadcasting: ${msg.sender} says "${msg.text}" to room "${msg.room}"`);
});

// Simulate a message being sent
const message = {
  sender: 'Alice',
  receiver: 'Bob',
  text: 'Hello Bob!',
  room: 'general',
};

chatEmitter.emit('message-sent', message);

