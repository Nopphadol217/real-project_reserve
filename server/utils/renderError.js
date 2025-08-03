const renderError = (res, status, message) => {
  return res.status(status).json({ message });
};

module.exports = renderError;
