const { networkInterfaces } = require('os');
const express = require('express');

// CSRF middleware
let csrf = require('csurf');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');

// middleware routing
// let csrfProtection = csrf({ cookie: { sameSite: 'strict' } });
// let parseForm = bodyParser.urlencoded({ extended: false });

// app config
const app = express();
const port = 8080;

// handle CSRF tokens
app.use(cookieParser());
app.get('/mapselect', csrfProtection, (req, res) => {
  res.render('send', { csrfToken: req.csrfToken() });
});

// start the application
app.use('/', express.static('../docs/html'));
app.use('/map', express.static('../aisdb_web/dist'));
app.use('/assets', express.static('../aisdb_web/dist/assets'));

app.listen(port, '::', () => {
  loop1: for (key of Object.keys(networkInterfaces()).reverse()) {
    if ([ 'lo', '127.0.0.1', '::1' ].indexOf(key) >= 0) {
      continue loop1;
    }

    loop2: for (net of networkInterfaces()[key].reverse()) {
      if (net.family == 'IPv4') {
        addr = net.address;
      } else if (net.family == 'IPv6' && net.scopeid == 0) {
        addr = `[${net.address}]`;
      } else {
        continue loop2;
      }

      console.log(`Docs available at http://${addr}:${port}\n`);

      break loop1;
    }
  }
});

