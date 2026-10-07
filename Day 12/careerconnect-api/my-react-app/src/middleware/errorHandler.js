export function notFound(request, response) {
  response.status(404).json({ success: false, message: "Route not found" });
}

export function errorHandler(error, request, response, next) {
  // Invalid JSON body
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return response.status(400).json({ success: false, message: "Invalid JSON in request body" });
  }

  const status = error.status || 500;
  if (status === 500) console.error(error);

  response.status(status).json({
    success: false,
    message: status === 500 ? "Internal server error" : error.message,
  });
}