# Job アーキテクチャ確認項目

- 各 entity の source of truth を定義する。
- 安定した dedupe key を定義する。
- 後段の解釈に必要な raw source content を永続化する。
- fetched / saved / failed 件数を含む sync summary を返す。
- job を安全に再実行できるようにする。
- rate limit のある外部アクセスを request/response route に持ち込まない。
- job を保留にする場合は、ソースコード削除ではなく scheduling 停止で切り分ける。
