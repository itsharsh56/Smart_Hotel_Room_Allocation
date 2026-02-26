const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "Room number already exists.",
      data: {},
    });
  }

  return res.status(statusCode).json({
    success: false,
    message: err.message || "Internal server error.",
    data: {},
  });
};

module.exports = errorHandler;
