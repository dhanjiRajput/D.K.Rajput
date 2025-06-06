const eventEmitter = require('events');
const fs = require('fs');
const { EventEmitter } = require('stream');
const emitter = new eventEmitter.EventEmitter();

// emitter.on('greet', (name) => {
//   console.log(`Hello, ${name}!`);
// });
// emitter.on('farewell', (name) => {  
//   console.log(`Goodbye, ${name}!`);
// });
// emitter.on('error', (err) => {
//   console.error('An error occurred:', err.message);
// });


// try {
//     emitter.emit('greet', 'Alice');
//     emitter.emit('farewell', 'Alice');
// } catch (error) {
//     emitter.emit('error', error);
//     console.error('Error caught in try-catch:', error.message);
// } 


const eventCounters={
    "user-login": 0,
    "user-logout": 0,
    "profile-update": 0,
    "user-purchase": 0, 
};

if (fs.existsSync('eventCounters.json')) {
    let data = fs.readFileSync('eventCounters.json', 'utf8');
    const savedData = JSON.parse(data);
    
    for (const key in savedData) {
        if (eventCounters.hasOwnProperty(key)) {
            eventCounters[key] = savedData[key];
        }
    }
}

emitter.on("user-login", (username) => {
    eventCounters["user-login"]++;
  console.log(`${username} has logged in.`);
    saveCountersToFile();
  
});
emitter.on("user-logout", (username) => {
    eventCounters["user-logout"]++;
  console.log(`${username} has logged out.`);
    saveCountersToFile();
});
emitter.on("profile-update", (username) => {
    eventCounters["profile-update"]++;
  console.log(`${username} has updated their profile.`);
    saveCountersToFile();
});
emitter.on("user-purchase", (username, item) => {
    eventCounters["user-purchase"]++;
  console.log(`${username} has purchased ${item}.`);
    saveCountersToFile();
});

emitter.on("summary", () => {
  console.log("Event Summary:");
  console.log(eventCounters);
});

function saveCountersToFile() {
    fs.writeFile('eventCounters.json', JSON.stringify(eventCounters),(err)=>{
        if (err) {
            console.error('Error saving counters to file:', err);
        }
    }); 
}


emitter.emit("user-login","dk");
emitter.emit("user-logout","dk");
emitter.emit("profile-update","dk");
emitter.emit("user-purchase","dk","laptop");
emitter.emit("summary");

console.log(emitter.listenerCount('user-login'));
 
