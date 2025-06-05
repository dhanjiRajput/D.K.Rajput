const {Worker}=require('bullmq');

const sendEmail=()=>new Promise((resolve,reject)=>{
    setTimeout(()=>{
        console.log('Email sent successfully');
        resolve();
    },5000);
});

const worker=new Worker('email-queue',async(job)=>{
    console.log(`Processing job with ID: ${job.id}`);
    console.log('Processing job data:');
    console.log(`Email: ${job.data.email}`);
    await sendEmail();
    console.log('Job completed successfully');
});