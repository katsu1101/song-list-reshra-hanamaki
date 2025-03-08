# 戸定梨香ちゃんの歌リスト

このリポジトリは千葉県ご当地VTuber戸定梨香さんがYouTube上で歌った歌を管理検索するためのNext.jsアプリケーションです。

## サイトURL

https://katsu1101.github.io/song-list-linca-tojou/
![戸定梨香ちゃんの歌リスト（スクリーンショット）.png](%E6%88%B8%E5%AE%9A%E6%A2%A8%E9%A6%99%E3%81%A1%E3%82%83%E3%82%93%E3%81%AE%E6%AD%8C%E3%83%AA%E3%82%B9%E3%83%88%EF%BC%88%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%B7%E3%83%A7%E3%83%83%E3%83%88%EF%BC%89.png)

## 機能概要

- 歌リスト取得スクリプト
  - 「きっくーのメモ帳」から歌リストデータを取得し、歌リストに合わせてYouTubeから動画データも取得しファイル出力
- PWAアプリケーション
  - 文字検索、タグ検索、検索結果をXにポスト
  - 動画再生（YouTubeリンク）
  - 歌再生（秒数指定YouTubeリンク）
  - 歌の付属情報（csvファイルを読み込んで付属情報を検索や表示に使用）

## 必要環境

- .envファイルでYouTube APIキーを設定

# セットアップ

1. リポジトリをクローン
```shell
git clone https://github.com/katsu1101/song-list-linca-tojou
cd song-list-linca-tojou
```

2. 依存関係をインストール
```shell
npm install
```
または
```shell
yarn install
```

3. .envファイルの用意
.env.exampleがある場合はコピーして.envにリネーム
APIキーやパスを追記

## 実行方法

### データ作成（json）
きっくーのメモ帳、YouTubeから曲、YouTube動画の情報を取得し、`songs.json`ファイルをさくせい
```shell
npm run generate:json
```

### 開発サーバ起動	
ローカルでNext.jsの開発サーバを起動 (http://localhost:3000)
```shell
npm run dev
```

### ビルド	
自動的に本番環境用の環境変数をセットして、ビルドを実行
```dotenv
NODE_ENV=production
NEXT_PUBLIC_BASE_PATH=/song-list-linca-tojou
```
```shell
npm run build
```

## ディレクトリ構成
```
.
├─ build/                 // Build結果出力ディレクトリ
├─ docs/                  // GitHubPages用公開ディレクトリ
├─ public/                // 公開ディレクトリ(アイコンやsongs.jsonなど)
├─ scripts/               // JSON生成などのスクリプト
├─ src/
│    ├─ app/              // アプリの本体
│    ├─ components/       // Reactコンポーネント
│    └─ Lib/              // アプリ側の共通処理
├─ next.config.ts         // Next.jsの設定
├─ tsconfig.json          // TypeScript設定
└─ package.json
```

## 環境変数について

```dotenv
YOUTUBE_API_KEY=　#YouTubeのAPI KEYを用意してここにセット
```

## デプロイ方法
### データのみをデプロイする場合
1. データ更新
```shell
npm run generate:json
```

2. docsにコピー
   docsディレクトリ内のファイルをすべて削除し、 
   buildディレクトリ内のファイルをすべてdocsディレクトリにコピー
   docsディレクトリ内のファイルをgitに追加

3. push
   git commit 
   git push

### アプリ全体をデプロイする場合
1. データ更新
```shell
npm run generate:json
```

2. build
```shell
npm run build
```

3. docsにコピー
   docsディレクトリ内のファイルをすべて削除し、
   buildディレクトリ内のファイルをすべてdocsディレクトリにコピー
   docsディレクトリ内のファイルをgitに追加

4. push
   git commit
   git push

## ライセンス

このプロジェクトは [MIT License](./LICENSE) のもとで公開しています。  
詳しくは `LICENSE` ファイルをご確認ください。

## 作者 / 関係者

- [かつき](https://x.com/katsu1101)：開発担当
- [きっくーさん](https://x.com/kicku_tw)：データ提供

## メモ

https://chatgpt.com/c/67bc054e-a8f0-8007-bcab-ecffd71b1d74