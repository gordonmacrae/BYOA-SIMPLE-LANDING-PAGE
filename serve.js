const express = require('express');
const app = express();

const findAvailablePort = (startPort) => {
  return new Promise((resolve, reject) => {
    const server = express()
      .listen(startPort, () => {
        const { port } = server.address();
        server.close(() => resolve(port));
      })
      .on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
          resolve(findAvailablePort(startPort + 1));
        } else {
          reject(err);
        }
      });
  });
};

app.use(express.static('./'));

const startServer = async () => {
  try {
    const port = await findAvailablePort(3000);
    app.listen(port, () => {
      console.log(`Server successfully started on port ${port}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
  }
};

startServer(); 