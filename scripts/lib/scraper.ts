import {YouTubeVideo} from "@/types";
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

  await page.goto(url, { waitUntil: 'domcontentloaded' });

  const data = await page.evaluate((source) => {
    let currentDate = '';

    return Array.from(document.querySelectorAll('p')).map(p => {
      const aTag = p.querySelector('a');
      const text = p.childNodes[0]?.textContent?.trim() || '';

      if (!text) return null; // 空のテキストを削除
      if (!aTag) {
        currentDate = text; // 日付と仮定
        return null;
      }

      // YouTube URL の解析
      const url = aTag.getAttribute('href') || '';
      let videoId = '';
      let rawTimestamp = '';

      try {
        const parsedUrl = new URL(url);
        const params = new URLSearchParams(parsedUrl.search);

        if (parsedUrl.pathname.startsWith('/watch')) {
          // 通常動画（https://www.youtube.com/watch?v=xxxx&t=xxxxs）
          videoId = params.get('v') || '';
          rawTimestamp = params.get('t') || '';
        } else if (parsedUrl.pathname.startsWith('/live/')) {
          // ライブ配信（https://www.youtube.com/live/xxxx?t=xxxxs）
          videoId = parsedUrl.pathname.split('/').pop() || '';
          rawTimestamp = params.get('t') || '';
        }
      } catch (e) {
        console.error('Invalid URL:', url, e);
      }
      const timestamp = rawTimestamp ? parseInt(rawTimestamp.replace('s', ''), 10) || 0 : 0;

      return {
        date: currentDate,
        title: text,
        url,
        videoId,
        timestamp,
        source,
      };
    }).filter(item => item !== null);
  }, source);

  await browser.close();
  return data;
}
