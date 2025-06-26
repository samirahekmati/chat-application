const cors = require("cors");

const corsOptions = {
  origin: [
    "https://gco0so88wow8cwc4so4k8koc.hosting.codeyourfuture.io",
  ],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
};

module.exports = cors(corsOptions);