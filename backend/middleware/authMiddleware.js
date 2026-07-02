const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token =
      req.headers.authorization.split(
        " "
      )[1];

    try {
      console.log(
        "Received Token:",
        token
      );

      const decoded =
        jwt.verify(
          token,
          process.env.JWT_SECRET
        );

      console.log(
        "Decoded Token:",
        decoded
      );

      req.user = decoded;

      next();

    } catch (error) {

      console.error(
        "JWT Error:",
        error.message
      );

      return res.status(401).json({
        success: false,
        message: "Not authorized",
        error: error.message,
      });

    }

  } else {

    console.log(
      "No Authorization Header Found"
    );

    return res.status(401).json({
      success: false,
      message: "No token",
    });

  }
};

module.exports = protect;