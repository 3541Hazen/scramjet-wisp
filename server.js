import { createServer } from "node:http";
import { server as wisp, logging } from "@mercuryworkshop/wisp-js/server";

const port = Number.parseInt(process.env.PORT || "8080", 10);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
	throw new Error("PORT must be an integer between 1 and 65535");
}

logging.set_level(logging.NONE);
Object.assign(wisp.options, {
	allow_udp_streams: false,
	allow_private_ips: false,
	allow_loopback_ips: false,
	dns_ttl: 300,
	dns_servers: ["1.1.1.3", "1.0.0.3"],
});

const sockets = new Set();
const server = createServer((request, response) => {
	response.setHeader("Cache-Control", "no-store");
	response.setHeader("Access-Control-Allow-Origin", "*");
	response.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
	if (request.method === "OPTIONS") {
		response.writeHead(204);
		response.end();
		return;
	}

	if (request.url === "/" || request.url === "/health") {
		response.writeHead(200, { "Content-Type": "text/plain" });
		response.end("Wisp server is running\n");
		return;
	}

	response.writeHead(404);
	response.end("Not found\n");
});

server.on("upgrade", (request, socket, head) => {
	if (request.url !== "/wisp/" && request.url !== "/wisp") {
		socket.destroy();
		return;
	}

	socket.on("error", () => socket.destroy());
	try {
		wisp.routeRequest(request, socket, head);
	} catch (error) {
		console.error("Wisp upgrade failed", error);
		socket.destroy();
	}
});

server.keepAliveTimeout = 65_000;
server.headersTimeout = 66_000;
server.requestTimeout = 15_000;
server.on("connection", (socket) => {
	sockets.add(socket);
	socket.on("close", () => sockets.delete(socket));
});
server.on("clientError", (_error, socket) => socket.destroy());

function shutdown(signal) {
	console.log(`${signal} received; closing server`);
	server.close(() => process.exit(0));
	for (const socket of sockets) socket.destroy();
	setTimeout(() => process.exit(1), 10_000).unref();
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

server.listen({ port, host: "0.0.0.0", backlog: 511 }, () => {
	console.log(`Wisp server listening on port ${port}`);
});
