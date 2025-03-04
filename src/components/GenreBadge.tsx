// components/GenreBadge.tsx

import {getGenreColors} from "@/lib/genreColors";
import {Genre}          from "@/types";

type Props = {
  genre?: Genre;
  onClick?: (genre: Genre) => void; // ✅ クリック時にジャンルを渡せる
};

const GenreBadge: React.FC<Props> = ({ genre, onClick }) => {
  const genreStyles = getGenreColors(genre);

  if (!genre) return null;
  return (
    <span
      className="ml-1 px-2 py-0.5 text-xs rounded-md font-bold leading-none inline-flex
        items-start cursor-pointer whitespace-nowrap"
      style={{
        backgroundColor: genreStyles?.background,
        color: genreStyles?.color,
        border: genreStyles?.border || "none",
        boxShadow: genreStyles?.boxShadow || "none",
        fontWeight: "bold",
        lineHeight: "1",
      }}
      onClick={() => onClick && genre && onClick(genre)} // ✅ クリック時に `genre` を渡す
    >
      {genre}
    </span>
  );
};

export default GenreBadge;
