import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { readJsonFile } from "./utils/file.js";
import { sendJson } from "./utils/response.js";

// ==========================================
// Current file directory
// ==========================================

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// ==========================================
// Data file paths
// ==========================================

const jobsFilePath = path.join(
    __dirname,
    "data",
    "jobs.json"
);

const candidatesFilePath = path.join(
    __dirname,
    "data",
    "candidates.json"
);


// ==========================================
// Port
// ==========================================

const port = process.env.PORT || 5000;


// ==========================================
// Create HTTP Server
// ==========================================

const server = http.createServer(
    async (request, response) => {

        try {

            // ==========================================
            // CORS Preflight
            // ==========================================

            if (request.method === "OPTIONS") {

                response.writeHead(204, {
                    "Access-Control-Allow-Origin":
                        "http://localhost:5173",

                    "Access-Control-Allow-Methods":
                        "GET, OPTIONS",

                    "Access-Control-Allow-Headers":
                        "Content-Type"
                });

                response.end();

                return;
            }


            // ==========================================
            // GET /api/status
            // ==========================================

            if (
                request.method === "GET" &&
                request.url === "/api/status"
            ) {

                sendJson(response, 200, {
                    success: true,
                    service: "CareerConnect API",
                    status: "running",
                    environment:
                        process.env.NODE_ENV ||
                        "development"
                });

                return;
            }


            // ==========================================
            // GET /api/jobs
            // ==========================================

            if (
                request.method === "GET" &&
                request.url === "/api/jobs"
            ) {

                try {

                    const jobs =
                        await readJsonFile(
                            jobsFilePath
                        );

                    sendJson(response, 200, {
                        success: true,
                        data: jobs
                    });

                } catch (error) {

                    console.error(
                        "Jobs Error:",
                        error
                    );

                    sendJson(response, 500, {
                        success: false,
                        message:
                            "Unable to load jobs"
                    });
                }

                return;
            }


            // ==========================================
            // GET /api/candidates
            // ==========================================

            if (
                request.method === "GET" &&
                request.url === "/api/candidates"
            ) {

                try {

                    const candidates =
                        await readJsonFile(
                            candidatesFilePath
                        );

                    sendJson(response, 200, {
                        success: true,
                        data: candidates
                    });

                } catch (error) {

                    console.error(
                        "Candidates Error:",
                        error
                    );

                    sendJson(response, 500, {
                        success: false,
                        message:
                            "Unable to load candidates"
                    });
                }

                return;
            }


            // ==========================================
            // GET /api/jobs/:id
            // Example:
            // /api/jobs/101
            // ==========================================

            if (
                request.method === "GET" &&
                request.url.startsWith(
                    "/api/jobs/"
                )
            ) {

                const parts =
                    request.url.split("/");

                const resource = parts[2];
                const id = parts[3];

                console.log(
                    "Resource:",
                    resource
                );

                console.log(
                    "ID:",
                    id
                );


                const jobs =
                    await readJsonFile(
                        jobsFilePath
                    );


                const job = jobs.find(
                    (item) =>
                        String(item.id) ===
                        String(id)
                );


                if (!job) {

                    sendJson(response, 404, {
                        success: false,
                        message:
                            `Job with ID ${id} not found`
                    });

                    return;
                }


                sendJson(response, 200, {
                    success: true,
                    data: job
                });

                return;
            }


            // ==========================================
            // GET /api/candidates/:id
            // Example:
            // /api/candidates/1
            // ==========================================

            if (
                request.method === "GET" &&
                request.url.startsWith(
                    "/api/candidates/"
                )
            ) {

                const parts =
                    request.url.split("/");

                const resource = parts[2];
                const id = parts[3];

                console.log(
                    "Resource:",
                    resource
                );

                console.log(
                    "ID:",
                    id
                );


                const candidates =
                    await readJsonFile(
                        candidatesFilePath
                    );


                const candidate =
                    candidates.find(
                        (item) =>
                            String(item.id) ===
                            String(id)
                    );


                if (!candidate) {

                    sendJson(response, 404, {
                        success: false,
                        message:
                            `Candidate with ID ${id} not found`
                    });

                    return;
                }


                sendJson(response, 200, {
                    success: true,
                    data: candidate
                });

                return;
            }


            // ==========================================
            // 404 - Unknown Route
            // ==========================================

            sendJson(response, 404, {
                success: false,
                message: "Route not found"
            });

        } catch (error) {

            console.error(
                "Server Error:",
                error
            );

            sendJson(response, 500, {
                success: false,
                message:
                    "Internal server error"
            });
        }
    }
);


// ==========================================
// Start Server
// ==========================================

server.listen(
    port,
    () => {

        console.log(
            `CareerConnect API running on http://localhost:${port}`
        );

    }
);