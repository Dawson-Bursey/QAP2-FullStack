const http = require("http");
const fs = require("fs");

//1. HTTP Stasu Codes: Log warnings and errors when response is sent with a ststus code of 4xx or 5xx.
//2. Specific Routes Access: Log a message every time a specific route is accessed.
//3. Non-Home Routes Access: Log a message every time a route that is not the home route is accessed.
//4. Successful file read: Log a message when a file is successfully read and sent to the client.
//5. File Not Available: Log a message when a file not found.

const EventEmitter = require("events");
const myEmitter = new EventEmitter();

myEmitter.on("status", (statusCode) => {
	console.log(`Status event captured: ${statusCode}`);
});

myEmitter.on("specificRoute", (route) => {
	console.log(`Specific route accessed: ${route}`);
});

myEmitter.on("nonHomeRoute", (route) => {
	console.log(`Non-home route accessed: ${route}`);
});

myEmitter.on("fileRead", (filePath) => {
	console.log(`File read successfully: ${filePath}`);
});

myEmitter.on("fileNotFound", (filePath) => {
	console.log(`File not found: ${filePath}`);
});

const server = http.createServer((req, res) => {
	const url = req.url;
	if (url !== "/") {
		myEmitter.emit("nonHomeRoute", url);
	}

	switch (url) {
		case "/about":
			myEmitter.emit("specificRoute", "/about");
			serveFile("views/about.html", res);
			break;

		case "/contact":
			serveFile("views/contact.html", res);
			break;

		case "/products":
			serveFile("views/products.html", res);
			break;

		case "/":
			serveFile("views/index.html", res);
			break;

		case "/subscribe":
			myEmitter.emit("specificRoute", "/subscribe");
			serveFile("views/subscribe.html", res);
			break;

		default:
			myEmitter.emit("status", 404);
			res.writeHead(404, { "Content-Type": "text/html" });
			res.end("<h1>Page Not Found</h1>");
	}
});

function serveFile(filePath, res, statusCode = 200) {
	fs.readFile(filePath, (err, data) => {
		if (err) {
			myEmitter.emit("status", 500);
			res.writeHead(500, { "Content-Type": "text/html" });
			res.end("<h1>Server Error</h1>");
		} else {
			res.writeHead(statusCode, { "Content-Type": "text/html" });
			res.write(data);
			res.end();
		}
	});
}

const PORT = 3000;
server.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});

//Task one and two are combined Below
// function serveFile(filePath, res) {
// 	fs.readFile(filePath, (err, data) => {
// 		if (err) {
// 			res.writeHead(500, { "Content-Type": "text/html" });
// 			res.end("<h1>Server Error</h1>");
// 		} else {
// 			res.writeHead(200, { "Content-Type": "text/html" });
// 			res.write(data);
// 			res.end();
// 		}
// 	});
// }

// const server = http.createServer((req, res) => {
// 	const url = req.url;

// 	switch (url) {
// 		case "/about":
// 			console.log("About page");
// 			serveFile("views/about.html", res);
// 			// res.writeHead(200, { "Content-Type": "text/html" }); Task 1
// 			// res.end("<h1>About Us</h1>");
// 			break;

// 		case "/contact":
// 			console.log("Contact page");
// 			serveFile("views/contact.html", res);
// 			// res.writeHead(200, { "Content-Type": "text/html" }); Task 1
// 			// res.end("<h1>Contact Us</h1>");
// 			break;

// 		case "/products":
// 			console.log("Products page");
// 			serveFile("views/products.html", res);
// 			// res.writeHead(200, { "Content-Type": "text/html" }); Task 1
// 			// res.end("<h1>Products</h1>");
// 			break;

// 		case "/":
// 			console.log("Home page");
// 			serveFile("views/index.html", res);
// 			// res.writeHead(200, { "Content-Type": "text/html" }); Task 1
// 			// res.end("<h1>Home</h1>");
// 			break;

// 		case "/subscribe":
// 			console.log("Subscribe page");
// 			serveFile("views/subscribe.html", res);
// 			// res.writeHead(200, { "Content-Type": "text/html" }); Task 1
// 			// res.end("<h1>Subscribe</h1>");
// 			break;
// 	}
// });

// const PORT = 3000;
// server.listen(PORT, () => {
// 	console.log(`Server is running on port ${PORT}`);
// });
