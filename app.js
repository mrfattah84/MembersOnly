const path = require('node:path');
const express = require('express');
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const indexRouter = require('./routes/indexRoute');
app.use('/', indexRouter);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
