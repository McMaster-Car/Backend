require('dotenv').config();

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var cors = require('cors')
const {
    connectRoute
} = require("./Router/index");

const uri = process.env.DATABASE_URL || "mongodb://localhost:27017/macMaster-Car";
// const uri =  "mongodb://localhost:27017/macMaster-Car";

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    mongoose.connection.useDb('macmaster-car');
    console.log('Connected to MongoDB')
})
  .catch((err) => console.log('Error connecting to MongoDB:', err));

var app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


connectRoute(app);

app.get("/", (req, res) => {
  res.send("Server is Running");
});
// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');





// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page if found
  res.status(err.status || 500);
  res.render('error');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


module.exports = app;