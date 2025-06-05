import emailQueue from "./index.js";

emailQueue.process(async (job) => {
    const { to, subject, body } = job.data;

    // Simulate sending an email
    console.log(`Sending email to: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${body}`);

    // Simulate a delay for sending the email
    await new Promise(resolve => setTimeout(resolve, 2000));
    return true;
});

emailQueue.on('completed', (job) => {
  console.log(`Job ${job.id} completed`);
});

emailQueue.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed:`, err);
});