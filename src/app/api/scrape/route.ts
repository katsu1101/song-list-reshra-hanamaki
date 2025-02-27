import { scrapeSongList } from "@/lib/scraper";
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import redis, { cacheKey } from '@/lib/redis';

export async function GET() {
  try {
    const url1 = process.env.SONG_LIST_URL1 || '';
    const url2 = process.env.SONG_LIST_URL2 || '';

    if (!url1 || !url2) {
      return NextResponse.json({ message: "Missing SONG_LIST_URL1 or SONG_LIST_URL2 in .env" }, { status: 400 });
    }

    // ✅ 2つのスクレイピングを並列実行（並列処理で高速化）
    const [data1, data2] = await Promise.all([scrapeSongList(url1), scrapeSongList(url2)]);

    // ✅ データを統合
    const data = [...data1, ...data2];
    console.log("Extracted Data:", data);

    // ✅ Prisma にデータを保存（重複を防ぐため upsert を使用）
    await Promise.all(data.map(async (item) => {
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
    }));

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
