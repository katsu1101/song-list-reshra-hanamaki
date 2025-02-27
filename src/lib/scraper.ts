import { chromium } from 'playwright';

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
