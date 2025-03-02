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

  await page.goto(url, { waitUntil: "domcontentloaded" });

  const data = await page.evaluate((source) => {
    let currentDate = ""; // 直前の日時を保存
    let results: any[] = [];

    const targetDiv = document.querySelector(".post-body.entry-content");
    if (!targetDiv) return [];

    targetDiv.childNodes.forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        // 直接のテキストノード (p, span の外にあるテキスト)
        const text = node.textContent?.trim();
        if (text) {
          currentDate = text; // 日付として仮定
        }
      } else if (node instanceof Element && (node.tagName === "P" || node.tagName === "SPAN")) {
        // <p> または <span> の処理
        const text = Array.from(node.childNodes)
          .filter(child => child.nodeType === Node.TEXT_NODE) // テキストノードのみ取得
          .map(child => child.textContent?.trim()) // 空白を削除
          .join('') // すべてのテキストを結合

        if (!text) return; // 空なら処理をスキップ

        if (!text) return;

        const aTag = node.querySelector("a");
        if (!aTag) {
          currentDate = text; // 日付として保持
          return;
        }

        // YouTube URL の解析
        const url = aTag.getAttribute("href") || "";
        let videoId = "";
        let rawTimestamp = "";

        try {
          const parsedUrl = new URL(url);
          const params = new URLSearchParams(parsedUrl.search);

          if (parsedUrl.pathname.startsWith("/watch")) {
            // 通常動画（https://www.youtube.com/watch?v=xxxx&t=xxxxs）
            videoId = params.get("v") || "";
            rawTimestamp = params.get("t") || "";
          } else if (parsedUrl.pathname.startsWith("/live/")) {
            // ライブ配信（https://www.youtube.com/live/xxxx?t=xxxxs）
            videoId = parsedUrl.pathname.split("/").pop() || "";
            rawTimestamp = params.get("t") || "";
          }
        } catch (e) {
          console.error("Invalid URL:", url, e);
        }

        const timestamp = rawTimestamp
          ? parseInt(rawTimestamp.replace("s", ""), 10) || 0
          : 0;

        results.push({
          date: currentDate, // 直前に取得した日付を適用
          title: text,
          url,
          videoId,
          timestamp,
          source,
        });
      }
    });

    return results;
  }, source);

  await browser.close();
  return data;
}

