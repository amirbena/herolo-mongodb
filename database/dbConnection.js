const mongoose = require('mongoose');


const dbConnection = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || `mongodb://localhost:27017/herolo` , { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: true });
        console.log("DB CONNECTED");
    } catch (ex) {
        console.error("Can't Connect DB", ex);
    }
}

dbConnection();