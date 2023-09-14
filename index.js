import express from "express";
import bodyParser from "body-parser";
import fetch from "node-fetch";

require("dotenv").config();

import { Gateway } from "./src/Gateway.js";

// Env Vars
const config = {
    API_ENDPOINT: process.env.API_ENDPOINT,
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    REDIRECT_URI: process.env.REDIRECT_URI,
    CODE_URI: process.env.CODE_URI
}

// Express Setup
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const port = 8020;

// User Request Token
let auth_token = "";

app.get("/login", (req, res) => {
    res.redirect(config.CODE_URI)
});

app.get("/", (req, res) => {
    res.send(`<a href="/login">Login</a>`);
});

app.get("/api/discord/callback", async (req, res) => {
    let query = req.query;

    if (query.code) {
        // Get User Code, exchange for token
        let code = query.code;

        exchangeCode(code);
    }

    setTimeout(() => {
        res.redirect("/")
    }, 1000);
});

let gateway;

/**
 * Exchanges the code for a user token
 * @param {int} code User Code from Auth Grant
 */
async function exchangeCode(code) {
    let data = new URLSearchParams({
        "client_id": config.CLIENT_ID,
        "client_secret": config.CLIENT_SECRET,
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": config.REDIRECT_URI
    });

    let conf = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };

    try {
        const resp = await fetch(`${config.API_ENDPOINT}/oauth2/token`, {
            method: "POST",
            body: data,
            headers: conf.headers
        });

        let dat = await resp.json();
        auth_token = dat.access_token;

        console.log(`Set Access Token.`);

        // Activates WSS Gateway
        gateway = new Gateway(auth_token);
        await gateway.start();
    } catch (err) {
        console.log(err);
    }

}

app.listen(port, async () => {
    console.log(`Hosting Service on ${port}`);
});