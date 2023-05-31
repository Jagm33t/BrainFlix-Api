const express = require("express");
const app = express();
const cors = require("cors");
const Videos = require('./routes/Videos');
//Images served as static assets
app.use(express.static('./public'));
app.use(express.json());
app.use(cors());

const port = 8080;

app.use('/videos', Videos);

app.listen(port, () => {
  console.log(`Express demo listening at port ${port}`);
});
