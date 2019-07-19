var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');

var app = express();


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'views')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


app.post('/login', (req,res) =>{

if(
  req.body.captcha === undefined ||
  req.body.captcha === '' ||
  req.body.captcha === null 
){
  return res.json({"success": false, "msg": "Please select captcha"});
}

// secret key
  const secretKey = '6LdyRa4UAAAAALqrXZTIrozGPrZ8fG81_4bNJ_Cr';

// verifi url
  const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body.captcha}
  &remoteip=${req.connection.remoteAddress}`;

// make request to verify url
request(verifyUrl, (err,response,body) => {
  body = JSON.parse(body);

  // if not successful
if(body.success !== undefined && !body.success){
  return res.json({"success": false, "msg": "Failed captcha verification"});
}
  // if success
  return res.json({"success": true, "msg": " Captcha passed"});

 });
});


module.exports = app;
