import app from "./app";

const PORT = process.env.PORT || 5001;

const http = require("http");
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
