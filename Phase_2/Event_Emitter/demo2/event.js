 class MyEventEmitter{
    constructor(){
        this.__event_listeners = {};
    };

    on(event, listener){
       if(!this.__event_listeners[event]){
           this.__event_listeners[event] = [];
       }
        this.__event_listeners[event].push(listener);
        return true;
    };

    emit(event, ...args){
        if(!this.__event_listeners[event]){
            return false;
        }
        
        const listener=this.__event_listeners[event];
        listener.forEach((listener)=>listener(...args));
    };

    off(event, listener){
        if(!this.__event_listeners[event]){
            return false;
        }
        
        const index = this.__event_listeners[event].indexOf(listener);
        if(index < 0){
            return false;
        }
        
        this.__event_listeners[event].splice(index, 1);
        return true;    
    };

    once(event, listener){
        const onceListener = (...args) => {
            listener(...args);
            this.off(event, onceListener);
        };
        this.on(event, onceListener);
        return true;
    };
 };

// export the class
const whatsapp=(username)=>console.log("whatsapp to ",username);

const emmiter = new MyEventEmitter();
emmiter.on('user:login', (username) => {
    console.log("user login", username);
});
emmiter.once('user:logout', whatsapp);
emmiter.on('user:login', (username) => {
    console.log("user login", username);
});
emmiter.on('user:logout', (username) => {
    console.log("user logout", username);
});


emmiter.emit('user:login', 'john');
emmiter.emit('user:login', 'doe');
emmiter.emit('user:logout', 'john');
