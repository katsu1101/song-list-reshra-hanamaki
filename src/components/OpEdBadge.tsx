// components/GenreBadge.tsx

import {getOpEdColors} from "@/lib/opEdColors";

type Props = {
  opEd: string;
  onClick?: (tag: string) => void; // ✅ クリック時にジャンルを渡せる
};

const OpEdBadge: React.FC<Props> = ({ opEd, onClick }) => {
  const genreStyles = getOpEdColors(opEd);

  if (!opEd) return null;
  return (
    <span
      className="ml-3 px-2 py-0.5 text-xs rounded-md font-bold leading-none inline-flex
        items-start cursor-pointer whitespace-nowrap"
      style={{
        backgroundColor: genreStyles?.background,
        color: genreStyles?.color,
        border: genreStyles?.border || "none",
        boxShadow: genreStyles?.boxShadow || "none",
        fontWeight: "bold",
        lineHeight: "1",
      }}
      onClick={() => onClick && opEd && onClick(opEd)} // ✅ クリック時に `genre` を渡す
    >
      {opEd}
    </span>
  );
};

export default OpEdBadge;
