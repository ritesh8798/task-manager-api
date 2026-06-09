const errorHandler = async (err, req, res, next) => {
  // Handle invalid MongoDB ID
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid ID format",
    });
  }

  // Handle duplicate field (e.g. email already registered)
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: "This email is already registered",
    });
  }

  // Default error
  const statusCode = err.statusCode || 500;
  const message = err.message || "Something went wrong";

  res.status(statusCode).json({
    success: false,
    message,
  });
};;

module.exports = errorHandler;
