import { prisma } from '@/lib/prisma';
import redis, {cacheKey} from '@/lib/redis';
import { SongsList } from '@/types'; // 型をインポート

export default async function Home() {
  // Redis からキャッシュを取得
  const cachedData = await redis.get(cacheKey);
  let songs: SongsList;
  if (cachedData) {
    songs = JSON.parse(cachedData);
  } else {
    // DBからデータを取得
    songs = await prisma.song.findMany({
      orderBy: [{ date: 'desc' }, { timestamp: 'asc' }],
    });

  }
  // 日付ごとにグループ化（videoIdごと）
  const groupedSongs: Record<string, Record<string, typeof songs>> = {};
  songs.forEach((song) => {
    if (!groupedSongs[song.date]) {
      groupedSongs[song.date] = {};
    }
    if (!groupedSongs[song.date][song.videoId]) {
      groupedSongs[song.date][song.videoId] = [];
    }
    groupedSongs[song.date][song.videoId].push(song);
  });

  return (
    <main className="max-w-4xl mx-auto p-4 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900">
      <h1 className="text-3xl font-bold text-center mb-6">YouTube Song List</h1>

      {Object.entries(groupedSongs).map(([date, videos]) => (
        <section key={date} className="mb-8">
          <h2 className="text-2xl font-semibold border-b-2 pb-2">{date}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {Object.entries(videos).map(([videoId, songs]) => (
              <div key={videoId} className="p-4 border rounded-lg shadow-md bg-gray-100 dark:bg-gray-800">
                <a
                  href={`https://www.youtube.com/watch?v=${videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <img
                    src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                    alt={songs[0].title}
                    className="w-full h-48 object-cover rounded-md"
                  />
                </a>
                <ul className="mt-2 space-y-2">
                  {songs.map((song) => (
                    <li key={song.timestamp} className="text-gray-800 dark:text-gray-200">
                      <a
                        href={`https://www.youtube.com/watch?v=${videoId}${song.timestamp ? `&t=${song.timestamp}` : ''}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block hover:underline"
                      >
                        <span className="font-medium">{song.title}</span>
                        {song.timestamp ? ' (' + song.timestamp + ')' : ''}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
