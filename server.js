require("dotenv").config({ path: ".env.local" });

const express = require("express");
const path = require("path");
const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/api/register", require("./api/register"));
app.post("/api/login", require("./api/login"));
app.get("/api/health", require("./api/health"));
app.use(express.static(path.join(__dirname, "public")));

function startServer(port) {
    const server = app.listen(port, () => {
        console.log(`GlobalMove server running at http://localhost:${port}`);
    });

    server.on("error", (error) => {
        if (error.code === "EADDRINUSE") {
            const nextPort = port + 1;
            console.warn(`Port ${port} is busy. Trying http://localhost:${nextPort}...`);
            startServer(nextPort);
            return;
        }

        console.error("Server error:", error);
        process.exit(1);
    });
}

startServer(PORT);