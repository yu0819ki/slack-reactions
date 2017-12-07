このリポジトリ上のソースは、[Slack Advent Calendar 2017](https://qiita.com/advent-calendar/2017/slack)の8日目の記事を書くために書かれました。

# 使い方

## APIトークンの用意
SlackのAPIトークンを取得します。トークンの取得方法は割愛します。必要なパーミッションは現在のところ以下の2つです（多分）
* reactions.get
* users.info

## リアクションを取得したい投稿のリンクを用意
PCなら投稿にホバーした時の右上から `Show message actions` > `Copy link`

## 実行
取得したトークンを環境変数 `SLACK_API_TOKEN` に、第一引数にリンクURLを指定して実行します。
　
```
$ SLACK_API_TOKEN="xxxxxxxx" npm start -- "https://aaaaaa.slack.com/archives/XXXX/p9999999999"
```
