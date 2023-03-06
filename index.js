import fetch from "node-fetch";
import { stringify } from "csv-stringify/sync";
import fs from "fs";
import line from "@line/bot-sdk";
import bodyParser from "body-parser";
import express from "express";
import jsdom from "jsdom";
import dotenv from "dotenv";
dotenv.config()
const {JSDOM} = jsdom;
const app = express();

const port = 3003;
const server = app.listen(port, () => {
    console.log("server is running ", port);
});

app.use(bodyParser.json());

// webhookに含まれる情報の取得
// app.post("/", (req, res, next) => {
//     console.log(req.body.events.map((handleEvent) => {
//         return handleEvent.source;
//     }))
// })

// LINEへのメッセージ送信（プッシュ）
app.post("/line/bot/push", async (req, res, next) => {
    const url = "https://api.line.me/v2/oauth/accessToken"
    const headers = {
        "Content-Type": "application/x-www-form-urlencoded"
    }
    const data = {
        "grant_type": "client_credentials",
        "client_id": process.env.CLIENT_ID,
        "client_secret": process.env.CLIENT_SECRET
    }
    const params = new URLSearchParams()
    Object.keys(data).forEach((key) => params.append(key, data[key]))
    const options = {
        method: "POST",
        headers: headers,
        body: params
    }
    const response = await fetch(url, options)
    const resTxt = await response.text()
    const token = JSON.parse(resTxt).access_token
    const client = new line.Client({
        channelAccessToken: token
    });
    const message = {
        type: "text",
        text: "Hello satoru"
    }
    client.pushMessage(process.env.USER_ID, message)
    res.sendStatus(200)
});

(async () => {
    //アクセストークン取得とLINE Clientインスタンスの作成
    const pushUrl = "https://api.line.me/v2/oauth/accessToken"
    const headers = {
        "Content-Type": "application/x-www-form-urlencoded"
    }
    const data = {
        "grant_type": "client_credentials",
        "client_id": process.env.CLIENT_ID,
        "client_secret": process.env.CLIENT_SECRET
    }
    const params = new URLSearchParams()
    Object.keys(data).forEach((key) => params.append(key, data[key]))
    const options = {
        method: "POST",
        headers: headers,
        body: params
    }
    const lineAuthRes = await fetch(pushUrl, options)
    const resTxt = await lineAuthRes.text()
    const token = JSON.parse(resTxt).access_token
    const client = new line.Client({
        channelAccessToken: token
    });
    
    //PRTIMESからプレスリリースを取得して通知のメッセージを作成
    const url = "https://prtimes.jp"
    const response = await fetch(url)
    const body = await response.text()
    const dom = new JSDOM(body)
    const articles = dom.window.document.querySelector(".top-latest-articles__container").children
    let resultTxt = ""
    for (let i = 0; i < articles.length; i++) {
        const articleDom = new JSDOM(articles[i].innerHTML)
        const title = articleDom.window.document.querySelector(".list-article__title")
        const anchor = articleDom.window.document.querySelector("a")
        const link = anchor.getAttribute("href")
        resultTxt = resultTxt.concat(!title ? "nothing\n\n": `${title.textContent.trim()}\n${url}${link}\n\n`)
    }

    //プッシュメッセージの送信
    const message = {
        type: "text",
        text: resultTxt
    }
    client.pushMessage(process.env.USER_ID, message)
})();

(async () => {
    //アクセストークン取得とLINE Clientインスタンスの作成
    const pushUrl = "https://api.line.me/v2/oauth/accessToken"
    const headers = {
        "Content-Type": "application/x-www-form-urlencoded"
    }
    const data = {
        "grant_type": "client_credentials",
        "client_id": process.env.CLIENT_ID,
        "client_secret": process.env.CLIENT_SECRET
    }
    const params = new URLSearchParams()
    Object.keys(data).forEach((key) => params.append(key, data[key]))
    const options = {
        method: "POST",
        headers: headers,
        body: params
    }
    const lineAuthRes = await fetch(pushUrl, options)
    const resTxt = await lineAuthRes.text()
    const token = JSON.parse(resTxt).access_token
    const client = new line.Client({
        channelAccessToken: token
    });
    
    //qiitaからトレンドを取得して通知のメッセージを作成
    const url = "https://qiita.com/"
    const response = await fetch(url)
    const body = await response.text()
    const dom = new JSDOM(body)
    const articles = dom.window.document.querySelector(".style-1p44k52").children
    let resultTxt = ""
    for (let i = 0; i < articles.length; i++) {
        const articleDom = new JSDOM(articles[i].innerHTML)
        const title = articleDom.window.document.querySelector("h2")
        const anchor = articleDom.window.document.querySelector("a")
        const link = anchor.getAttribute("href")
        resultTxt = resultTxt.concat(!title ? "nothing\n\n": `${title.textContent.trim()}\n${link}\n\n`)
    }

    //プッシュメッセージの送信
    const message = {
        type: "text",
        text: resultTxt
    }
    client.pushMessage(process.env.USER_ID, message)
})();