// const express = require('express');
// const path = require('path');
// const cluster = require('cluster');
// const numCPUs = require('os').cpus().length;
// const router = require("./router");

// const isDev = process.env.NODE_ENV !== 'production';
// const PORT = process.env.PORT || 3002;

// // Multi-process to utilize all CPU cores.
// if (!isDev && cluster.isMaster) {
//   console.error(`Node cluster master ${process.pid} is running`);

//   // Fork workers.
//   for (let i = 0; i < numCPUs; i++) {
//     cluster.fork();
//   }

//   cluster.on('exit', (worker, code, signal) => {
//     console.error(`Node cluster worker ${worker.process.pid} exited: code ${code}, signal ${signal}`);
//   });

// } else {
//   const app = express();

//   // Priority serve any static files.
//   app.use(express.static(path.resolve(__dirname, '../client/build')));

//   // Answer API requests.
//   app.use(router);

//   // All remaining requests return the React app, so it can handle routing.
//   app.get('*', function(request, response) {
//     response.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
//   });

//   app.listen(PORT, function () {
//     console.error(`Node ${isDev ? 'dev server' : 'cluster worker '+process.pid}: listening on port ${PORT}`);
//   });
// }

// const router = require("./router");
const path = require('path');
const express = require("express");
const router = require("./router/index");
// const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3002;



// // Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(morgan('combined'));
// // Add routes - this connects and activates API
app.use(router);
// app.use(express.static(path.join(__dirname, './client/public')));

// // If its production environment!
// if (process.env.NODE_ENV === 'production') {
//     // console.log('YOU ARE IN THE PRODUCTION ENV');
//     // app.use('/static', express.static(path.join(__dirname, '../client/build')));
//     // app.use(express.static(path.join(__dirname, './client/build')))
//     // app.get('/', (req, res) => {
//     //     res.sendFile(path.join(__dirname, './client/build/index.html'))
//     // })

//     const root = require('path').join(__dirname, 'client', 'build')
//     app.use(express.static(root));
//     app.get("*", (req, res) => {
//         res.sendFile('index.html', { root });
//     })
// }

if (process.env.NODE_ENV === 'production') {
    console.log('YOU ARE IN THE PRODUCTION ENV');
    app.use(express.static(path.join(__dirname, 'build')));

    app.get('/*', function (req, res) {
        res.sendFile(path.join(__dirname, 'build', 'index.html'));
    });
}

// // Start the API server
app.listen(PORT, function () {
    console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
});


// RUN THIS IN NGROK
// ./ngrok http 3000 -host-header="localhost:3000"

