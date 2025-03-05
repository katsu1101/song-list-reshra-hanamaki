import {YouTubeVideo} from "../../src/types";
import axios          from "axios";
import { chromium }   from 'playwright';
import dotenv         from "dotenv";

// 配列を指定したサイズごとに分割する関数
const chunkArray = <T>(arr: T[], size: number): T[][] =>
  arr.reduce<T[][]>((acc, _, i) => (i % size ? acc : [...acc, arr.slice(i, i + size)]), []);

export const fetchVideos = async (videoIds: string[]): Promise<Record<string, YouTubeVideo>> => {
  const chunks = chunkArray(videoIds, 50);
  const allVideos: Record<string, YouTubeVideo> = {};

  dotenv.config();
  const API_KEY = process.env.YOUTUBE_API_KEY;

  for (const chunk of chunks) {
    try {
      const url = `https://www.googleapis.com/youtube/v3/videos?id=${chunk.join(",")}&part=snippet,contentDetails,statistics&key=${API_KEY}`;
      const response = await axios.get<{ items: YouTubeVideo[] }>(url);

      // 取得した動画データを `{ id: { data } }` の形式で保存
      response.data.items.forEach((video) => {
        allVideos[video.id] = video;
      });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Error fetching videos:", error.response?.data || error.message);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  }
  return allVideos;
};

export async function scrapeSongList(url: string, source: number) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // console.log(`url: ${url}`);
  await page.goto(url, { waitUntil: "domcontentloaded" });

  // ブラウザの console.log を Node.js 側でキャッチ
  page.on("console", (msg) => {
    console.log(`BROWSER LOG: ${msg.text()}`);
  });

  const data = await page.evaluate((source) => {
    let currentDate = ""; // 直前の日時を保存
    // console.log(`source: ${source}`);
    const results: any[] = [];

    const targetDiv = document.querySelector(".post-body.entry-content");
    // console.log(`targetDiv: ${targetDiv}`);
    if (!targetDiv) return [];
    targetDiv.childNodes.forEach((node) => {

      if (node.nodeType !== Node.ELEMENT_NODE || !(node instanceof Element) || node.tagName !== "P") {
        return
      }

      if (node.childNodes.length === 1) {
        // 日付
        currentDate = (node.childNodes[0] as Element).textContent?.trim() || "";
        return
      }
      // `p` タグの内容を取得

      let title = "";
      let artist = "";
      let work = "";
      let note = "";
      let videoUrl = "";
      let videoId = "";
      let timestamp = 0;
      node.childNodes.forEach((child) => {

        if (child.nodeType === Node.TEXT_NODE) {
          // テキストノードの処理
          const text = (child as Element).textContent?.trim();
          if (! text) return;

          if (text.startsWith("♪")) {
            artist = text.replace("♪", "").trim();
          } else if (text.startsWith("『") && text.endsWith("』")) {
            work = text.replace(/『|』/g, "").trim();
          } else if (text.startsWith("(") && text.endsWith(")")) {
            note = text.replace(/\(|\)/g, "").trim();
          } else {
            title = text;
          }
        } else if (! (node instanceof Element)) {
          return
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          if ((child as Element).tagName === "BR") {
            // `<br>` は単なる改行なので無視（処理の区切りには使わない）
            return;
          } else if ((child as Element).tagName === "A") {
            // `<a>` タグの処理（YouTube URL 抽出）
            const url = (child as Element).getAttribute("href") || "";
            if (!url) return;

            try {
              const parsedUrl = new URL(url);
              const params = new URLSearchParams(parsedUrl.search);

              if (parsedUrl.pathname.startsWith("/watch")) {
                videoId = params.get("v") || "";
                timestamp = parseInt(params.get("t") || "0", 10);
              } else if (parsedUrl.pathname.startsWith("/live/")) {
                videoId = parsedUrl.pathname.split("/").pop() || "";
                timestamp = parseInt(params.get("t") || "0", 10);
              }

              videoUrl = url;
            } catch (e) {
              console.error("Invalid URL:", url, e);
            }
          }
        }
      });

      results.push({
          date: currentDate, // 直前に取得した日付を適用
          title,
          artist,
          work,
          note,
          url: videoUrl,
          videoId,
          timestamp,
          source,
        })
    }, source);

    return results;
  }, source);

  await browser.close();

  // console.log(JSON.stringify(data, null, 2));

  return data;
}

