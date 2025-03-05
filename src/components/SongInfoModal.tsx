import GenreBadge                   from "@/components/GenreBadge";
import OpEdBadge                    from "@/components/OpEdBadge";
import {Song}                       from "@/types";
import React, { useRef, useEffect } from "react";
import { Search }                   from "lucide-react"; // アイコンをインポート（lucide-reactを使用）

type Props = {
  song: Song;
  onClose: () => void
  onTextSearch: (q: string) => void
}
const SongInfoModal: React.FC<Props> = ({ song, onClose, onTextSearch }) => {
  const infoRef = useRef<HTMLDivElement>(null);

  const handleSearch = (q: string,  onClose: () => void) => {
    onTextSearch(q)
    onClose()
  }
  // クリック外で閉じる
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (infoRef.current && !infoRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div ref={infoRef} className="bg-white dark:bg-gray-800 p-6 rounded-md shadow-lg w-96">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          ♪ {song.title}
        </h2>

        {/* 詳細情報テーブル */}
        <table className="w-full border-collapse">
          <tbody>
          {song.artist && (
            <tr className="border-b border-gray-300 dark:border-gray-600">
              <td className="text-nowrap py-2 pr-4 font-semibold text-gray-700 dark:text-gray-300">アーティスト</td>
              <td className="py-2 text-gray-900 dark:text-gray-100">
                {song.artist}
                <button
                  className="ml-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  onClick={() => handleSearch(song.artist || "", onClose)}
                >
                  <Search size={16} />
                </button>
              </td>
            </tr>
          )}
          {(song.work || song.info?.work) && (
            <tr className="border-b border-gray-300 dark:border-gray-600">
              <td className="text-nowrap py-2 pr-4 font-semibold text-gray-700 dark:text-gray-300">作品</td>
              <td className="py-2 text-gray-900 dark:text-gray-100">
                {song.work || song.info?.work}
                <button
                  className="ml-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  onClick={() => handleSearch(song.work || song.info?.work || "", onClose)}
                >
                  <Search size={16} />
                </button>
              </td>
            </tr>
          )}
          {song.note && (
            <tr className="border-b border-gray-300 dark:border-gray-600">
              <td className="text-nowrap py-2 pr-4 font-semibold text-gray-700 dark:text-gray-300">注釈</td>
              <td className="py-2 text-gray-900 dark:text-gray-100">{song.note}</td>
            </tr>
          )}

          {song.info?.release && (
            <tr className="border-b border-gray-300 dark:border-gray-600">
              <td className="text-nowrap py-2 pr-4 font-semibold text-gray-700 dark:text-gray-300">リリース日</td>
              <td className="py-2 text-gray-900 dark:text-gray-100">{song.info.release}</td>
            </tr>
          )}
          {song.info?.album && (
            <tr className="border-b border-gray-300 dark:border-gray-600">
              <td className="text-nowrap py-2 pr-4 font-semibold text-gray-700 dark:text-gray-300">アルバム</td>
              <td className="py-2 text-gray-900 dark:text-gray-100">{song.info.album}</td>
            </tr>
          )}
          {song.info?.genre && (
            <tr className="border-b border-gray-300 dark:border-gray-600">
              <td className="text-nowrap py-2 pr-4 font-semibold text-gray-700 dark:text-gray-300">ジャンル</td>
              <td className="py-2 text-gray-900 dark:text-gray-100">
                <GenreBadge
                  genre={song.info?.genre}
                  onClick={() => {handleSearch("#" + song.info?.genre, onClose)}}
                />
              </td>
            </tr>
          )}
          {song.info?.lyricist && (
            <tr className="border-b border-gray-300 dark:border-gray-600">
              <td className="text-nowrap py-2 pr-4 font-semibold text-gray-700 dark:text-gray-300">作詞</td>
              <td className="py-2 text-gray-900 dark:text-gray-100">
                {song.info.lyricist}
                <button
                  className="ml-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  onClick={() => handleSearch(song.info?.lyricist || "", onClose)}
                >
                  <Search size={16} />
                </button>
              </td>
            </tr>
          )}
          {song.info?.composer && (
            <tr className="border-b border-gray-300 dark:border-gray-600">
              <td className="text-nowrap py-2 pr-4 font-semibold text-gray-700 dark:text-gray-300">編曲</td>
              <td className="py-2 text-gray-900 dark:text-gray-100">
                {song.info.composer}
                <button
                  className="ml-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  onClick={() => handleSearch(song.info?.composer || "", onClose)}
                >
                  <Search size={16} />
                </button>
              </td>
            </tr>
          )}
          {song.info?.arranger && (
            <tr className="border-b border-gray-300 dark:border-gray-600">
              <td className="text-nowrap py-2 pr-4 font-semibold text-gray-700 dark:text-gray-300">編曲</td>
              <td className="py-2 text-gray-900 dark:text-gray-100">
                {song.info.arranger}
                <button
                  className="ml-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  onClick={() => handleSearch(song.info?.arranger || "", onClose)}
                >
                  <Search size={16} />
                </button>
              </td>
            </tr>
          )}
          {song.info?.opEd && (
            <tr className="border-b border-gray-300 dark:border-gray-600">
              <td className="text-nowrap py-2 pr-4 font-semibold text-gray-700 dark:text-gray-300">OP/ED区分</td>
              <td className="py-2 text-gray-900 dark:text-gray-100">
                <OpEdBadge opEd={song.info.opEd} onClick={() => {
                  handleSearch("#" + song.info?.opEd || "", onClose)
                }} />
              </td>
            </tr>
          )}
          </tbody>
        </table>

        {/* 閉じるボタン */}
        <button
          className="mt-4 w-full px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none"
          onClick={onClose}
        >
          ✖ 閉じる
        </button>
      </div>
    </div>
  );
};

export default SongInfoModal;
