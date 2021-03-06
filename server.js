const router = require("./router");
const express = require("express");
const morgan = require('morgan');
const cors = require("cors");
// const http = require("http");
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3002;


app.use(morgan('combined'))
app.use(cors());
// // Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(morgan('combined'));

// If its production environment!
if (process.env.NODE_ENV === 'production') {
  console.log('YOU ARE IN THE PRODUCTION ENV');
  app.use(express.static(path.join(__dirname, './client/build')));
}
// app.get("/", function(req, res) {
// 	res.sendFile(__dirname + "/index.html");
// });
app.use(router);
// const server = http.Server(app);
// // Start the API server
app.listen(PORT, function(res, err) {
	console.log(`🌎  ==> Delayed Server now listening on PORT ${PORT}!`);

	if (err) {
		console.err("there is an ERROR", err)
	}
  });


// RUN THIS IN NGROK
// ./ngrok http 3000 -host-header="localhost:3000"

