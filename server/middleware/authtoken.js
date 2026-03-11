const jwt = require("jsonwebtoken");
const db = require("../models");
const secret = process.env.JWT_SECRET;
const helper = require("../helper/helper");
const { Validator } = require("node-input-validator");
module.exports = {
  verifyToken: async (req, res, next) => {
    try {
      if (!req.headers.authorization) {
        return helper.failed(res, "Token missing.");
      }

      const authHeader = req.headers["authorization"];
      const token = authHeader.split(" ")[1];

      const decoded = jwt.verify(token, secret);

      const userData = await db.users.findByPk(decoded.id, {
        attributes: { exclude: ["password"] },
      });
      if (!userData) {
        return helper.error(res, "Session expired. Please login again.", 401);
      }

      req.admin = userData;

      next();
    } catch (error) {
      return helper.failed(res, "Token not found", 403);
    }
  },
};
