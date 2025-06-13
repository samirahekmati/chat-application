const cors = require("cors");

const corsOptions = {
  origin: [
    "https://gco0so88wow8cwc4so4k8koc.hosting.codeyourfuture.io",
    "http://localhost:5500" // keep for local dev
  ],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
};

module.exports = cors(corsOptions);