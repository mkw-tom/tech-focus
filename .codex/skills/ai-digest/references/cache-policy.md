# ダイジェストのキャッシュ方針

- ダイジェストは、永続化済み raw source content から導出される派生データとして扱う。
- cache key は source item と source revision ごとに安定する形にする。
- raw source content が変わったとき、または保存済み digest version を無効化したときだけ再計算する。
- プロダクト挙動としては、in-memory や request-local cache より DB 永続化を優先する。
- cache の参照と write-back の責務は service に持たせる。
