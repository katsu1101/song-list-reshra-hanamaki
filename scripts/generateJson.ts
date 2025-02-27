import path             from "path";
import {scrapeSongList} from "../src/lib/scraper";
import * as fs          from "fs";


const SONG_LIST_URL1 = "https://kicku-tw.blogspot.com/2023/06/youtube01.html#more"
const SONG_LIST_URL2 = "https://kicku-tw.blogspot.com/2023/06/youtube02.html#more"

async function generateJson() {
  const url1 = SONG_LIST_URL1 || "";
  const url2 = SONG_LIST_URL2 || "";

  if (!url1 || !url2) {
    console.error("Missing SONG_LIST_URL1 or SONG_LIST_URL2 in .env");
    process.exit(1);
  }

  const [data1, data2] = await Promise.all([
    scrapeSongList(url1, 1),
    scrapeSongList(url2, 2),
  ]);

  const data = { songs: [...data1, ...data2] };

  // ✅ `public/songs.json` に保存
  const filePath = path.join(process.cwd(), "public", "songs.json");
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  console.log("✅ songs.json has been generated!");
}

generateJson().catch(console.error);
