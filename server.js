const express = require("express");
const session = require('express-session');
const cors = require("cors");
require("dotenv").config();
const app = express();
app.use(cors());



// let data;
// let data.data.id;
const credentials = `${process.env.DYTE_ORG_ID}:${process.env.DYTE_API_KEY}`;
const encodedApiKey = btoa(credentials);

// set up express-session middleware
app.use(session(
  {
  secret: encodedApiKey ,  // replace with your own secret key
  resave: true,
  saveUninitialized: true,
}
));

app.get("/api/meeting", async (req, res) => {
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
  req.session.myData = data.data.id;
  
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

app.get("/api/leave", async (req, res) => {
  // if (!data) {

  const myData = req.session.myData;
  const neededID = JSON.stringify(myData);

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${encodedApiKey}`,
      }
    };



    fetch(
      `https://api.cluster.dyte.in/v2/meetings/${myData}/active-session/kick-all`,
      options
    )
    .then((response) => response.json())
      .then((response) => {
        // if (response.success === true) {
          // res.json(`${data.data.id}`);
          res.json(response.success);
        // }
      });
  // }
});

app.listen(5000, () => {
  console.log(`Server is started on 5000 and ${process.env.DYTE_ORG_ID}`);
});

module.exports = app;

// https://app.dyte.io/meeting/stage/ROOM_NAME_HERE?authToken=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcmdJZCI6ImVmYTBiMzhkLTc0NDItNDYwZi1hOTMwLTRmZTA0MGUwOWI2YiIsIm1lZXRpbmdJZCI6ImJiYjlkODNjLWY5MmQtNGU5NS04YzhjLTBhNjAzOWEzNmZkMiIsInBhcnRpY2lwYW50SWQiOiJhYWFkZmFlYy0wNDQzLTQ0YTYtOGU2Ni1iYjcyZjg1NzA4OGMiLCJwcmVzZXRJZCI6IjIyZTM5YjA3LWU3OGEtNGU1NS1iYzY0LTY0ZjU4ZWQ4ZmQ3YSIsImlhdCI6MTY4MjA2ODk2MSwiZXhwIjoxNjkwNzA4OTYxfQ.p2U2laKTw69x5Yi763Hb0wuwJD6_NwEpY2AUf18gtbmMBJiff3rfhcO6fNQAohndw3SUFPwrzqh5aIdK5o_cTFCIs0h9rK6cfnfYmfIAZZjgWKON2tNjr7Tr2_dfkf41H0MsTNgh2toyIjbx58DkeI1ASCC3VpFAPe9vAbE9QfDn4k0NLJr_2R2MKmb5Bsr9szhKCzk-uRXCoFVNaYHjndzpnc7sKwIUguMizkBpith3I77URng5IvZDR6K7wVyrwG6SIvMnFzb52PZe-UCENMmeCSP1RO6x5h4yLAYy9StDiAmnkmOrSzMUWrRkxIchLgMpMvJYYpR9E0OPn4FQaQ