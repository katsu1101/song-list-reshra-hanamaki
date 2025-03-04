type Props = {
  menuOpen: boolean
  onClick?: () => void; // ✅ クリック時にジャンルを渡せる
};

const Menu: React.FC<Props> = ({ menuOpen, onClick }) => {


  const menuItems = [
    { name: "YouTube（戸定梨香）", url: "https://youtube.com/@linca_tojou?si=tDAbk7IO_RccPD5m" },
    { name: "𝕏（戸定梨香）", url: "https://x.com/Tojou_Linca" },
    { name: "データ提供（きっくーのメモ帳）", url: "https://kicku-tw.blogspot.com/" },
    { name: "𝕏（かつき）", url: "https://x.com/katsu1101" }
  ];

  return <div className="relative">
    <button
      onClick={onClick}
      className="text-xl text-blue-500 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300"
    >
      ☰
    </button>
    {menuOpen && <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 shadow-lg rounded-md overflow-hidden border border-gray-300 dark:border-gray-700 z-[999]">
        <ul className="text-sm text-gray-900 dark:text-gray-200">
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
