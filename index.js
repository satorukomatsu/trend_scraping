import fetch from "node-fetch";
import { stringify } from "csv-stringify/sync";
import Iconv from "iconv-lite"
import fs from "fs"
import jsdom from "jsdom"
const {JSDOM} = jsdom;

(async () => {
    const url = "https://prtimes.jp/"
    const response = await fetch(url)
    const body = await response.text()
    const dom = new JSDOM(body)
    const articles = dom.window.document.querySelector(".top-latest-articles__container").children
    const result = []
    for (let i = 0; i < articles.length; i++) {
        const articleDom = new JSDOM(articles[i].innerHTML)
        const title = articleDom.window.document.querySelector("h3")
        result.push(!title ? ["nothing"]: {"number": i, "title": title.textContent.trim()})
    }
    const output = stringify(result)
    const outputSjis = Iconv.encode(output, "Shift_JIS")
    console.log(output)
    fs.writeFileSync("PR_Times.csv", output)
})();