import axios from "axios";
import cheerio from "cheerio";

export default async (req, res) => {
  try {
    const site = req.query.site;
    console.log("site", site);
    const resp = await axios.get(site);
    const $ = cheerio.load(resp.data);
    const text = $("#content").text();
    res.send(
      `<div id="content">${text
        .replace("hｔｔｐs://m•ｈetｕshu.com•cｏm", "")
        .replace("ｍ.hｅtｕsｈu•com•ｃom", "")
        .replace("hetushu.com.com", "")}</div>`
    );
  } catch (err) {
    console.log(err);
    res.status(500).send("Unable to load contents");
  }
};
