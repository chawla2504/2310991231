const axios = require("axios");
require("dotenv").config();

const Log = async (stack, level, pkg, message) => {
  try {
    await axios.post(
      "http://20.207.122.201/evaluation-service/logs",
      {
        stack,
        level,
        package: pkg,
        message
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.TOKEN}`
        }
      }
    );
  } catch (err) {
    console.log("Log error:", err.message);
  }
};

module.exports = Log;