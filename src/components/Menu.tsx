type Props = {
  menuOpen: boolean
  onClick?: () => void; // ✅ クリック時にジャンルを渡せる
};

const Menu: React.FC<Props> = ({ menuOpen, onClick }) => {

  const menuItems = [
    { name: "YouTube（戸定梨香）", url: "https://youtube.com/@linca_tojou?si=tDAbk7IO_RccPD5m" },
    { name: "𝕏（戸定梨香）", url: "https://x.com/Tojou_Linca" },
    { name: "Fanitia（戸定梨香のとじょりんワールド）", url: "https://fantia.jp/fanclubs/70005" },
    { name: "SUZURI（とじょりんがいっぱい）", url: "https://suzuri.jp/lincatojou" },

    { name: "LINEスタンプ", url: "https://store.line.me/stickershop/product/20411879/ja"},
    { name: "ローソンプリント", url: "https://lawson-print.com/products/categories/vase"},
    { name: "ファミマプリント", url: "https://famima-print.family.co.jp/vtuber/vase-59tnz" },

    { name: "VASE 公式サイト", url: "https://www.vase.tokyo/" },
    { name: "ASE OFFICIAL STORE", url: "https://ase-store.com/?category_id=67888c9a6e449503ebae7c96" },

    { name: "きっくーのメモ帳（データ提供元）", url: "https://kicku-tw.blogspot.com/" },
    { name: "𝕏（かつき）", url: "https://x.com/katsu1101" },
    { name: "とじょりん聖地（茶月兄チャマ）", url: "https://maps.app.goo.gl/oLhPAWA7RqTj8eXK7" },
    { name: "ちばっことじょりん（茶月兄チャマ）", url: "https://maps.app.goo.gl/Ce7naG5KTSxGPcwv8" },
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
