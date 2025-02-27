import { NextResponse } from 'next/server';
import { scrapeSongList } from '@/lib/scraper';

export async function GET() {
  try {
    const url1 = process.env.SONG_LIST_URL1 || '';
    const url2 = process.env.SONG_LIST_URL2 || '';

    if (!url1 || !url2) {
      return NextResponse.json({ message: "Missing SONG_LIST_URL1 or SONG_LIST_URL2 in .env" }, { status: 400 });
    }

    // ✅ 並列でスクレイピング
    const [data1, data2] = await Promise.all([scrapeSongList(url1, 1), scrapeSongList(url2, 2)]);

    // ✅ JSON を統合してレスポンスとして返す
    return NextResponse.json({ songs: [...data1, ...data2] });

  } catch (error) {
    return NextResponse.json({ message: "Error generating JSON", error: error }, { status: 500 });
  }
}
