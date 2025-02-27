import { NextResponse } from 'next/server';
import { chromium } from 'playwright';
import { prisma } from '@/lib/prisma';
import redis, {cacheKey} from '@/lib/redis';

export async function GET() {
  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('https://kicku-tw.blogspot.com/2023/06/youtube02.html#more', { waitUntil: 'domcontentloaded' });

    const data = await page.evaluate(() => {
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
        let timestamp = '';

        try {
          const parsedUrl = new URL(url);
          const params = new URLSearchParams(parsedUrl.search);

          if (parsedUrl.pathname.startsWith('/watch')) {
            // 通常動画（https://www.youtube.com/watch?v=xxxx&t=xxxxs）
            videoId = params.get('v') || '';
            timestamp = params.get('t') || '';
          } else if (parsedUrl.pathname.startsWith('/live/')) {
            // ライブ配信（https://www.youtube.com/live/xxxx?t=xxxxs）
            videoId = parsedUrl.pathname.split('/').pop() || '';
            timestamp = params.get('t') || '';
          }
        } catch (e) {
          console.error('Invalid URL:', url, e);
        }

        return {
          date: currentDate,
          title: text,
          url,
          videoId,
          timestamp,
        };
      }).filter(item => item !== null);
    });


    console.log("Extracted Data:", data);

    // 既存データの重複を防ぐため、DB に upsert（新規 or 更新）する
    for (const item of data) {
      await prisma.song.upsert({
        where: {
          videoId_timestamp: {
            videoId: item.videoId,
            timestamp: item.timestamp,
          }
        },
        update: item,  // 既存データは更新
        create: item,  // 新規データは作成
      });
    }

    await browser.close();

    // ✅ Redis のキャッシュを削除
    await redis.del(cacheKey);

    return NextResponse.json({ message: "Scrape API Executed", data });
  } catch (error) {
    console.error("Scraping failed:", error);
    return NextResponse.json({
      message: "Scraping failed",
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
