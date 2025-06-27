const jwt = require("jsonwebtoken");
const renderError = require("../utils/renderError");

exports.authCheck = async (req, res, next) => {
  const token = req.cookies.token;
  

  try {

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          return res.status(401).json({ message: "Token expired" });
        }
        return renderError(401, "Unauthorized");
      }
  
      req.user = decoded;
      next();

  })

    
  } catch (error) {
    console.log(error);
  }
};
