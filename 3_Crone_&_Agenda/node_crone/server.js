const express = require('express');
const dotenv=require('dotenv').config();
const PORT = process.env.PORT || 5001;

// require('./scheduler1');
require('./scheduler2');

const app = express();
app.use(express.json());


app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});