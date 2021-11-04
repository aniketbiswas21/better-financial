import axios from "axios";

import config from "../keys";

const key = Buffer.from(`${config.ARGYLE_ID}:${config.ARGYLE_SECRET}`).toString(
  "base64"
);

export default axios.create({
  baseURL: config.ARGYLE_API_URI,
  responseType: "json",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Basic ${key}`,
  },
});
