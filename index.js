// index.js
// where your node app starts

// init project
var express = require("express");
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require("cors");
app.use(cors({ optionsSuccessStatus: 200 })); // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

function isPossiblyUnixTimestamp(date) {
  if (typeof date !== "number" || isNaN(date)) {
    return false;
  }
  const lowerBound = new Date("1970-01-01").getTime();
  const upperBound = new Date("2100-01-01").getTime();

  return date >= lowerBound && date <= upperBound;
}

function getUnixTimestamp(dateString) {
  console.log(dateString);

  if (isNaN(dateString.getTime())) {
    return null;
  }
  return dateString.getTime();
}

function unixToUTC(unixTimestampInMilliseconds) {
  // Ensure valid timestamp type (number)
  if (typeof unixTimestampInMilliseconds !== "number") {
    throw new Error("Invalid timestamp format: Must be a number");
  }

  const date = new Date(unixTimestampInMilliseconds);
  return date.toUTCString();
}

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/api/:date", function (req, res) {
  let dateString;
  let x = isPossiblyUnixTimestamp(Number(req.params.date));
  if (x) {
    dateString = new Date(req.params.date);
    const utcString = unixToUTC(Number(req.params.date));
    console.log("unix", req.params.date);

    res.json({ unix: Number(req.params.date), utc: utcString });
  } else {
    dateString = new Date(req.params.date);

    const utcString = dateString.toUTCString();
    const unixTimestamp = getUnixTimestamp(dateString);

    if (!unixTimestamp) {
      return res.status(400).send({ error: "Invalid Date" }); // Handle invalid dates
    }

    res.json({ utc: utcString, unix: unixTimestamp });
  }
});

app.get("/api/", function (req, res) {
  let dateString;

  dateString = new Date();

  const utcString = dateString.toUTCString();
  const unixTimestamp = getUnixTimestamp(dateString);

  if (!unixTimestamp) {
    return res.status(400).send({ error: "Invalid Date" }); // Handle invalid dates
  }

  res.json({ utc: utcString, unix: unixTimestamp });
});

// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
