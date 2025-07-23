const jsonServer = require('json-server');
const path = require('path');

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults({ static: './' }); // Serve index.html

server.use(middlewares);
server.use(jsonServer.bodyParser);
server.use('https://weekly-to-do-list4.onrender.com/tasks', router); // Your API endpoint

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
