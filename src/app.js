const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');

require('dotenv').config();
const {connectDB} = require('./config/connectDB');
const initWebRouter = require('./routes/index');

const app = express();
app.use(bodyParser());
app.use(cors({
  origin: [
    'http://localhost:3006',
  ],
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(express.static(path.join(__dirname, 'public')));
app.use('/public', express.static(path.join(__dirname, 'public/img')));
connectDB();

initWebRouter(app);

const port = process.env.port || 6969;
app.listen(port, () => {
  console.log(`server run on port :${port}`);
});
