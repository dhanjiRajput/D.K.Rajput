const {Queue} =require('bullmq');

const notificationqueue = new Queue('email-queue');

async function addToQueue() {
    const res= await notificationqueue.add('email to dk', {
        email: 'dk@gmail.com',
        subject: 'Hello from BullMQ',
        text: 'This is a test email sent using BullMQ'
    });
    console.log(`Added job with ID: ${res.id}`);

};
