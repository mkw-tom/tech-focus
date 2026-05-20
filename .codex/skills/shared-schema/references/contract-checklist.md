# Contract 確認項目

- この shape は app 境界をまたいで共有されるか。
- runtime validation はその境界に置くべきか。
- この field は string ではなく enum にするべきか。
- frontend は backend が返す payload と同じものを parse しているか。
- 近い重複 schema を新設するより、既存 schema を拡張できないか。
- schema と一緒に inferred type も export しているか。
