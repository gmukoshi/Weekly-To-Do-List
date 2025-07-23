// server.js
import { create, router as _router, defaults, bodyParser } from 'json-server';
import path from 'path';
const server = create();
const router = _router('db.json');
const middlewares = defaults({
  static: './'  // Serves index.html and static files
});

server.use(middlewares);
server.use(bodyParser);
server.use('/tasks', router); // So you fetch from /tasks

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
});
