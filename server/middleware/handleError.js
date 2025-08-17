const handleError = (res, err) => {
  console.error("Error:", err);
  
  res
    .status(err.statusCode || err.status || 500)
    .json({ 
      success: false,
      message: err.message || "Something Wrong!!" 
    });
};

module.exports = handleError;
