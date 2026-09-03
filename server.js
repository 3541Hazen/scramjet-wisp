import { createServer } from "node:http";
import { server as wisp, logging } from "@mercuryworkshop/wisp-js/server";

const port = Number.parseInt(process.env.PORT || "8080", 10);

logging.set_level(logging.NONE);
Object.assign(wisp.options, {
	allow_udp_streams: false,
	dns_servers: ["1.1.1.3", "1.0.0.3"],
});

const server = createServer((request, response) => {
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
	if (request.url === "/wisp/" || request.url === "/wisp") {
		wisp.routeRequest(request, socket, head);
		return;
	}
	socket.end();
});

server.listen(port, "0.0.0.0", () => {
	console.log(`Wisp server listening on port ${port}`);
});
