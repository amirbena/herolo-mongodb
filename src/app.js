const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const cors = require('cors');

require('dotenv').config();


const routes = require('./routes');

const app = express();
app.use(cors());
app.use(bodyParser.json());

/* app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars'); */


app.use('/users', routes.UserRoutes)
app.use('/messages', routes.MessageRoutes);


const PORT = process.env.PORT;


const server = app.listen(PORT, () => console.log(`Server is running on ${PORT} port`));

module.exports = server