# バックエンド責務境界チェック

## Routes

- リクエストの解析
- shared schema の検証
- service の呼び出し
- response の整形

## Services

- product rule
- repository / fetcher をまたぐ orchestration
- digest の参照や生成トリガーの判断
- summary の組み立て

## Repositories

- Prisma query
- upsert
- transaction の制御
- product 解釈は持たない

## Fetchers

- HTTP request
- source 固有の response 解析
- DB write はしない

## Jobs

- 定期実行 orchestration
- collection のみ
- ユーザー向け文言生成はしない
