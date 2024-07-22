import http from "http";
import dotenv from "dotenv";
import app from './index'

import home from "./api/routes/auth/home.route"

dotenv.config();

const PORT = process.env.PORT;

const server = http.createServer(app);

app.use(home);

server.listen(PORT, () => {
    console.log("Server running on port", PORT);
});