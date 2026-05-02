import { Server } from "socket.io";

let io;

export function initSocket(httpServer) {
    io = new Server(httpServer, {
        cors: {
            origin: process.env.CLIENT_URL || "http://localhost:5173",
            credentials: true,
        }
    });

    console.log("Socket.io server is running");

    io.on("connection", (socket) => {
        console.log("A user connected:", socket.id);

        socket.on("join-incident", (incidentId) => {
            socket.join(`incident:${incidentId}`);
            console.log(`User joined incident room: incident:${incidentId}`);
        });

        socket.on("join-admin", () => {
            socket.join("admin");
            console.log("User joined admin room");
        });

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });
}

export function getIO() {
    if (!io) {
        throw new Error("Socket.io not initialized");
    }
    return io;
}