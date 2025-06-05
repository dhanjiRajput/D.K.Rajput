import Queue from 'bull';

const emailQueue = new Queue('emailQueue', 'redis://127.0.0.1:6379');

emailQueue.add({
    to:'dk@gmail.com',
    subject: 'Welcome to our service',
    body: 'Thank you for signing up!'
});

export default emailQueue;