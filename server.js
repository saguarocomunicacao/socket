const express = require("express");
const app = express();
const path = require("path");
const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(express.json());
app.use(express.static(__dirname)); // serve index.html, etc

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "index.html"));
});

app.post("/emitir", (req, res) => {
  const { canal, dados } = req.body;
  console.log("🔁 Emitindo via HTTP POST:", canal, dados);
  io.emit(canal, dados);
  res.json({ status: "ok" });
});

io.on("connection", (socket) => {
  console.log("📡 Cliente conectado.");
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`🚀 Servidor rodando na porta ${port}`);
});
