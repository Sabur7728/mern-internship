export function sendJson(response, statusCode, data) {
    response.writeHead(statusCode, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "http://localhost:5173",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type"
    });

    response.end(JSON.stringify(data));
}