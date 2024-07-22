require('dotenv').config();
const mongoose = require('mongoose');

const { DB_USER, DB_PASS, DB_HOST, DB_PORT, DB_NAME } = process.env;
const credentials = DB_USER && DB_PASS ? `${DB_USER}:${DB_PASS}@` : '';
const mongoURI = `mongodb://${credentials}${DB_HOST}:${DB_PORT}/${DB_NAME}`;

mongoose.connect(mongoURI).then(
  () => {
    console.log('DB is Connected');
  },
  (err) => {
    console.error('DB CONNECTION FAILED:', err);
  }
);

module.exports = mongoose;
