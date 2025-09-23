type Props = {
  menuOpen: boolean
  onClick?: () => void; // ✅ クリック時にジャンルを渡せる
};

const Menu: React.FC<Props> = ({ menuOpen, onClick }) => {

  const menuItems = [
    { name: "𝕏（花巻レシュラ）", url: "https://x.com/ReshRa_vase" },

    { name: "𝕏（かつき）", url: "https://x.com/katsu1101" },
    { name: "𝕏（シンタロス🔮🐏）", url: "https://x.com/shintarosu1010" },

    { name: "戸定梨香ちゃんの歌リスト", url: "https://katsu1101.github.io/song-list-linca-tojou/" },
  ];

  return <div className="relative">
    <button
      onClick={onClick}
      className="text-xl text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300"
    >
      ☰
    </button>
    {menuOpen && <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 shadow-lg rounded-md overflow-hidden border border-gray-300 dark:border-gray-700 z-[999]">
        <ul className="text-xs text-gray-900 dark:text-gray-200">
          {menuItems.map((item, index) => (
            <li key={index} className="border-b border-gray-200 dark:border-gray-700">
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block pl-6 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      </div>}
  </div>
};

export default Menu;
