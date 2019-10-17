const express = require('express');
const port = process.env.PORT || 8080;
const app = express();

app.use(express.static(__dirname + "/dist/"));

// Reroute all traffic to the main app.
app.get(/.*/, function(req, res) {
    res.sendFile(__dirname + "/dist/index.html");
});

app.listen(port);

