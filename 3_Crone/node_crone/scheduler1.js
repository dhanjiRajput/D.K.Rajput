const cron=require('node-cron');

const task=()=>{
    console.log("Running a scheduled task at : ",new Date());
};

cron.schedule('* * * * * *', task);
// * * * * * *  - every second will reschedule task
// seconds    minutes    hours    day of month    month    day of week