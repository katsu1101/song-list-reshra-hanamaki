import path                                          from "path";
import {fetchVideos, scrapeLinkList, scrapeSongList} from "./lib/scraper";
import * as fs                                       from "fs";


// const SONG_LIST_URL1 = "https://kicku-tw.blogspot.com/2023/06/youtube01.html#more"
const SONG_LIST_URL1 = "https://kicku-tw.blogspot.com/2025/03/2.html"
// const SONG_LIST_URL2 = "https://kicku-tw.blogspot.com/2023/06/youtube02.html#more"
const SONG_LIST_URL2 = "https://kicku-tw.blogspot.com/2025/03/blog-post.html"

const LINK_LIST_URL = "https://kicku-tw.blogspot.com/p/blog-page_27.html"

const dataVersionPath = path.join(process.cwd(), "public", "data-version.json");

const updateDataVersion = () => {
  const timestamp = new Date().toISOString();
  fs.writeFileSync(dataVersionPath, JSON.stringify({ version: timestamp }, null, 2));
  console.log(`✅ Data version updated: ${timestamp}`);
};

updateDataVersion();

async function generateJson() {

  const [data1, data2] = await Promise.all([
    scrapeSongList(SONG_LIST_URL1, 1),
    scrapeSongList(SONG_LIST_URL2, 2)
  ]);

  const songs = [...data1, ...data2]

  // ✅ videoId のユニークな一覧を取得
  const videoIds = [...new Set(songs.map(song => song.videoId))];

  const videos = await fetchVideos(videoIds)

  const data = { songs: songs, videos: videos };

  // ✅ `public/songs.json` に保存
  const filePath = path.join(process.cwd(), "public", "songs.json");
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  // Link List
  const linkList = await scrapeLinkList(LINK_LIST_URL)

  // const res = await fetch();
  // const csvText = await res.text();
  const filePath2 = path.join(process.cwd(), "public", "linkList.json");
  fs.writeFileSync(filePath2, JSON.stringify(linkList, null, 2));

  console.log("✅ songs.json has been generated!");
}

generateJson().catch(console.error);
