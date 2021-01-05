const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

require('dotenv').config();


const routes = require('./routes');

const app = express();
app.use(cors());
app.use(bodyParser.json());




app.use('/users', routes.UserRoutes)
app.use('/messages', routes.MessageRoutes);

app.get('/', (req, res) => {
    res.send("Wellcome to my Heroku app, please use /users & /messages to enjoy misson's API")
})

const PORT = process.env.PORT || 4040;


const server = app.listen(PORT, () => console.log(`Server is running on ${PORT} port`));

module.exports = server