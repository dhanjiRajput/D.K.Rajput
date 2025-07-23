import emailQueue from "./emailQueue.js";

emailQueue.process(async (job)=>{
    const {to,subject,body}=job.data;
    console.log(`Sending Mail to ${to} - ${subject}`);

    await new Promise((r)=>setTimeout(r,1000));
});