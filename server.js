// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();
var dayjs = require('dayjs');
var utc = require('dayjs/plugin/utc');
dayjs.extend(utc);

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// API date endpoint returns following timestamp
// { unix: 1451001600000, utc: "Fri, 25 Dec 2015 00:00:00 GMT" }
app.get("/api/", function (req, res) {
  res.json({
    unix: dayjs().valueOf(),
    utc: dayjs().utc().format('ddd, DD MMM YYYY HH:mm:ss [GMT]')
  });
});

app.get("/api/:date", function (req, res) {
  let input = req.params.date;
  if (!dayjs(input).isValid()) {
    res.json({ error: "Invalid Date" });
  } else {
    if ((/\D/).test(input)) {
      res.json({
        unix: dayjs(input).valueOf(),
        utc: dayjs(input).utc().format('ddd, DD MMM YYYY HH:mm:ss [GMT]')
      })
    } else if (input.length === 10 || input.length === 13) {
      let unixDate = input.length === 10 ? Number(input) * 1000 : Number(input);
      let utcDate = new Date(unixDate);
      res.json({
        unix: unixDate,
        utc: dayjs(utcDate).utc().format('ddd, DD MMM YYYY HH:mm:ss [GMT]')
      })
    } else {
      res.json({ error: "Invalid Date" });
    } 
  }
});


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
