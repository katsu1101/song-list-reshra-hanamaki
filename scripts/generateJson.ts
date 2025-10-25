import path                                          from "path";
import {fetchVideos, scrapeLinkList, scrapeSongListFromText} from "./lib/scraper";
import * as fs                                       from "fs";

const dataVersionPath = path.join(process.cwd(), "public", "data-version.json");

const updateDataVersion = () => {
  const timestamp = new Date().toISOString();
  fs.writeFileSync(dataVersionPath, JSON.stringify({ version: timestamp }, null, 2));
  console.log(`✅ Data version updated: ${timestamp}`);
};

updateDataVersion();

async function generateJson() {

  const text1 = fs.readFileSync(path.join(process.cwd(), "data", "songlist1.txt"), "utf-8");
  const songs = scrapeSongListFromText(text1, 1);

  // ✅ videoId のユニークな一覧を取得
  const videoIds = [...new Set(songs.map(song => song.videoId))];

  const videos = await fetchVideos(videoIds)

  const data = { songs: songs, videos: videos };

  // ✅ `public/songs.json` に保存
  const filePath = path.join(process.cwd(), "public", "songs.json");
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  console.log("✅ songs.json has been generated!");
}

generateJson().catch(console.error);
