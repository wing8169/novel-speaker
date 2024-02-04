import axios from "axios";
import { load } from "cheerio";
import puppeteer from "puppeteer";

function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

export default async (req, res) => {
  try {
    const site = req.query.site;
    console.log("site", site);
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Navigate the page to a URL
    await page.goto(site);
    await delay(2000);

    // handle uukanshu
    if (site.includes("uukanshu")) {
      const textSelector = await page.waitForSelector("#contentbox");
      const text = await textSelector?.evaluate((el) => el.textContent);
      await browser.close();

      res.send(
        `<div id="content">${text
          .replace(/hｔｔｐs:\/\/m•ｈetｕshu.com•cｏm/g, "")
          .replace(/ｍ.hｅtｕsｈu•com•ｃom/g, "")
          .replace(/hetushu.com.com/g, "")
          .replace(/&nbsp;/g, "")
          .replace(/\xA0/g, " ")
          .replace(/UU看书 wｗw.uukanshu．net/g, "")}</div>`
      );
      return;
    }

    const divs = await page.$$("#content div");
    let rslt = "";
    for (const div of divs) {
      const tmpText = await div?.evaluate((el) => el.textContent);
      const tmpStyle = await div?.evaluate((el) => {
        const style = window.getComputedStyle(el).getPropertyValue("display");
        return style;
      });
      if (tmpStyle !== "block") continue;
      rslt += tmpText;
    }

    await browser.close();

    res.send(
      `<div id="content">${rslt
        .replace(/hｔｔｐs:\/\/m•ｈetｕshu.com•cｏm/g, "")
        .replace(/ｍ.hｅtｕsｈu•com•ｃom/g, "")
        .replace(/hetushu.com.com/g, "")
        .replace(/&nbsp;/g, "")
        .replace(/\xA0/g, " ")
        .replace(/UU看书 wｗw.uukanshu．net/g, "")}</div>`
    );
  } catch (err) {
    console.log(err);
    res.status(500).send("Unable to load contents");
  }
};
