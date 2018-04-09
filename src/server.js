const express = require("express");
const app = express();
const http = require('http').Server(app);
const cors = require('cors');
const port = process.env.PORT || 3701;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello")
});

const server = http.listen(port, () => {
  const port = server.address().port;
console.log(`Http server listening at http://localhost:${port}`);
});
