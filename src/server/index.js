import path from 'path';
import http from 'http';
import https from 'https';
import fs from 'fs';
import express from 'express';
import bodyParser from 'body-parser';
import './dotenv';
import compression from 'compression';

(async () => {
  const app = express();

  app.use(compression());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  app.get('*.gz', (req, res, next) => {
    res.set('Content-Type', 'application/javascript');
    res.set('Content-Encoding', 'gzip');
    next();
  });

  // This sets where all the public files can be served from.
  app.use(express.static(path.join(process.env.PWD, 'dist/')));

  app.post('/crypto', (req, res) => {
    const crypto = req.body.details.meta;
    if (!crypto) {
      res.json('Add a cryptocurrency name to the meta field');
      return;
    }
    https.get('https://api.coinmarketcap.com/v1/ticker/', resp => {
      let data = '';
      resp.on('data', chunk => {
        data += chunk;
      });
      resp.on('end', () => {
        const result = JSON.parse(data).filter(e => e.id === crypto.toLowerCase())[0];
        if (result) {
          res.json(`Got new reading for ${crypto}: $${result.price_usd}`);
        } else {
          res.json(`Could not find entry for ${crypto}`);
        }
      });
    });
  });

  // serve all endpoints the index
  app.get('*', (req, res) => {
    res.sendFile(path.join(process.env.PWD, 'dist/index.html'));
  });

  const port = process.env.PORT || '3000';
  app.set('port', port);

  // HTTPS
  if (process.env.ENV === 'production') {
    // Redirect traffic from http to https
    const redirectApp = express();

    redirectApp.get('*', (req, res) => {
      res.redirect('https://' + req.headers.host + req.url);
    });
    const redirectHttp = http.createServer(redirectApp);
    redirectHttp.listen(80);

    // Setup credentials
    const credentials = {
      key: fs.readFileSync(process.env.PRIVATE_KEY, 'utf8'),
      cert: fs.readFileSync(process.env.CERTIFICATE, 'utf8'),
      ca: fs.readFileSync(process.env.CA, 'utf8'),
    };
    const httpsServer = https.createServer(credentials, app);
    httpsServer.listen(443, () => {
      console.info('HTTPS Server running on port 443');
    });
  } else {
    // For dev server
    const server = http.createServer(app);
    server.listen(port, () => console.info(`Site running on localhost:${port}`));
  }
})();
