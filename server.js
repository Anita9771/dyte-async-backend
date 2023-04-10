const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
app.use(cors());

let data;

app.get("/api/meeting", async (req, res) => {
  const credentials = `${process.env.DYTE_ORG_ID}:${process.env.DYTE_API_KEY}`;
  const encodedApiKey = btoa(credentials);

  const response = await fetch("https://api.cluster.dyte.in/v2/meetings", {
    method: "POST",
    headers: {
      Authorization: `Basic ${encodedApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: "Dyte Async Platform",
      record_on_start: true,
      live_stream_on_start: false,
    }),
  });
  const data = await response.json();

  if (data.success === true) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${encodedApiKey}`,
      },
      body: '{"preset_name":"group_call_host","custom_participant_id":"owner"}',
    };

    fetch(
      `https://api.cluster.dyte.in/v2/meetings/${data.data.id}/participants`,
      options
    )
      .then((response) => response.json())
      .then((response) => {
        if (response.success === true) {
          res.json(response.data.token);
        }
      });
  }
});

app.get("/api/leave-meeting", async (req, res) => {
  const credentials = `${process.env.DYTE_ORG_ID}:${process.env.DYTE_API_KEY}`;
  const encodedApiKey = btoa(credentials);

  if (data.success === true) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${encodedApiKey}`,
      }
    };

    fetch(
      `https://api.cluster.dyte.in/v2/meetings/${data.data.id}/active-session/kick-all`,
      options
    )
    .then(res => res.json())
    .then(json => console.log(json))
    .catch(err => console.error('error:' + err));
  }
});

app.listen(5000, () => {
  console.log(`Server is started on 5000 and ${process.env.DYTE_ORG_ID}`);
});

module.exports = app;
