const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);

// Add custom routes before JSON Server router
server.get('/api/status', (req, res) => {
  res.json({ message: 'Weekly To-Do List API is running!' });
});

// Use default router
server.use('/api', router);

const PORT = process.env.PORT || 3000;
server.listen(PORT,() => {
  console.log(`JSON Server is running on port ${PORT}`);
  console.log(`API endpoints available at http://localhost:${PORT}/api`);
});