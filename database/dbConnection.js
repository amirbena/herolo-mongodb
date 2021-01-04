const mongoose = require('mongoose');


const dbConnection = async () => {
    const DB_NAME = process.env.DB_NAME;
    console.log("DB_NAME",DB_NAME);
    try {
        await mongoose.connect(process.env.MONGODB_URI || `mongodb://localhost:27017/${DB_NAME}` , { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true });
        console.log("DB CONNECTED");
    } catch (ex) {
        console.error("Can't Connect DB", ex);
    }
}

dbConnection();