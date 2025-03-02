export const checkVersionAndUpdateCache = async (): Promise<void> => {
  const currentBuildVersion = localStorage.getItem("build-version");
  const currentDataVersion = localStorage.getItem("data-version");

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  try {
    const [buildRes, dataRes] = await Promise.all([
      fetch(`${basePath}/build-version.json`),
      fetch(`${basePath}/data-version.json`),
    ]);

    const newBuildVersion = (await buildRes.json()).version;
    const newDataVersion = (await dataRes.json()).version;

    if (newBuildVersion !== currentBuildVersion) {
      console.log("⚠️ ビルドバージョンが変更されました。キャッシュをクリアします...");
      await clearCache();
      localStorage.setItem("build-version", newBuildVersion);
      localStorage.setItem("data-version", newDataVersion);
      location.reload(); // 全体リロード
    } else if (newDataVersion !== currentDataVersion) {
      console.log("🔄 データバージョンが変更されました。データキャッシュのみクリア...");
      await clearCache();
      localStorage.setItem("data-version", newDataVersion);
    }
  } catch (error) {
    console.error("バージョンチェックに失敗しました:", error);
  }
};

const clearCache = async (): Promise<void> => {
  if ("caches" in window) {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map(cache => caches.delete(cache)));
    console.log("✅ キャッシュをクリアしました。");
  }
};
