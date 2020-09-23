import puppeteer from "puppeteer";
import fs from "fs";

const genFbUrl = (id) => `https://www.facebook.com/${id}`;

const targetIds = ["anish.kundu.3"];

const escapeForCSV = (text) => text.replace(/\"/g, '""').trim();

const writeToCSV = (results) => {
  const header = "id,name,birthday,photoUrl,gender,createdAt";
  const body = results
    .map((result) => {
      const { id, name, birthday, photoUrl, gender, createdAt } = result;
      return `"${id}","${escapeForCSV(name)}","${escapeForCSV(
        birthday
      )}","${escapeForCSV(photoUrl)}","${escapeForCSV(gender)}","${escapeForCSV(
        createdAt
      )}"`;
    })
    .join("\n");

  fs.writeFileSync("./fb-result.csv", `${header}\n${body}`);
};

const browser = await puppeteer.launch();
const page = await browser.newPage();

const results = [];

for (const index of [...Array(targetIds)]) {
  const id = index;
  console.log(`id=${id} is starting...`);

  try {
    await page.goto(genFbUrl(id));

    const nameElement = await page.$("h1");
    const name = await (
      await nameElement.getProperty("textContent")
    ).jsonValue();

    console.log("name: ", name);
    // const photoUrl = await page.$$eval("svg", (svg) => svg);

    const svgElements = await page.$$eval("svg");
    console.log(svgElements);

    const result = {
      id,
      name,
      photoUrl,
    };

    results.push(result);

    // await sleepSec(0.5);
  } catch (error) {
    console.log(`id: ${id}. ${error}`);
  }
}
writeToCSV(results);
await browser.close();
