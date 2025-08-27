/*
Job to check this status of invoices and if status is "PAID", move it to the archive folder
 */

const cron = require('node-cron');
const path = require('path');
const fs = require('fs');

const invoices=require('./Data/invoice.json');

const archiveInvoicesTask = () => {
    console.log("Running Archive Invoices Task at: ", new Date());
    try {
        const paidInvoices=invoices.filter((item)=>{
            return item.status === "paid";
        })

        console.log("Filtered Paid Invoices : ",paidInvoices);
        

        if(paidInvoices.length > 0){

            unpaidDataForInvoiceFile = invoices.filter(x => x.status !== 'paid')

            fs.writeFileSync(path.join(__dirname, './','Data', 'invoice.json'), JSON.stringify(unpaidDataForInvoiceFile),'utf-8');

            console.log("The Invoice are  : ",unpaidDataForInvoiceFile);

            let archivedInvoices = [];
            const archivePath = path.join(__dirname, './', 'Data', 'archive.json');
            if (fs.existsSync(archivePath)) {
                const archiveContent = fs.readFileSync(archivePath, 'utf-8');
                if (archiveContent) {
                    archivedInvoices = JSON.parse(archiveContent);
                }
            }
            archivedInvoices = archivedInvoices.concat(paidInvoices);
            fs.writeFileSync(archivePath, JSON.stringify(archivedInvoices), 'utf-8');

            fs.writeFileSync(path.join(__dirname, './','Data', 'archive.json'), JSON.stringify(paidInvoices),'utf-8');

            console.log("The Paid Invoice are : ",paidInvoices);
        }
    } catch (error) {
        console.log("Error occurred while archiving invoices: ", error);
    }
    console.log("Running Archive Invoices Task are ended");
};

cron.schedule('*/10 * * * * *', archiveInvoicesTask);