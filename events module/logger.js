const EventEmitter=require('events');

class Logger extends EventEmitter{
    log(message){
        console.log(message);
        
        this.emit('messagelogged',{username:'dhanji',email:'dhanji@gmail.com'});
    }
}

module.exports=Logger;