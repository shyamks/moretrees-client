import http from 'http';

let app = require('./server').default;

const server = http.createServer(app);

let currentApp = app;

let port = process.env.PORT || 3000
server.listen(port, error => {
  if (error) {
    console.log(error);
  }

  console.log(`🚀 started in port: ${port}`);
});

if (module.hot) {
  console.log('✅  Server-side HMR Enabled!');

  module.hot.accept('./server', () => {
    console.log('🔁  HMR Reloading `./server`...');

    try {
      app = require('./server').default;
      server.removeListener('request', currentApp);
      server.on('request', app);
      currentApp = app;
    } catch (error) {
      console.error(error);
    }
  });
}
