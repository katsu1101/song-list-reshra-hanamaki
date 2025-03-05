import path                        from "path";
import {fetchVideos, scrapeSongList} from "./lib/scraper";
import * as fs                     from "fs";


// const SONG_LIST_URL1 = "https://kicku-tw.blogspot.com/2023/06/youtube01.html#more"
const SONG_LIST_URL1 = "https://kicku-tw.blogspot.com/2025/03/2.html"
// const SONG_LIST_URL2 = "https://kicku-tw.blogspot.com/2023/06/youtube02.html#more"
const SONG_LIST_URL2 = "https://kicku-tw.blogspot.com/2025/03/blog-post.html"

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

  // console.log(data. videos);

  // ✅ `public/songs.json` に保存
  const filePath = path.join(process.cwd(), "public", "songs.json");
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  console.log("✅ songs.json has been generated!");
}

generateJson().catch(console.error);
