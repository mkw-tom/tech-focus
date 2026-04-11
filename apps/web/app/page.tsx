export default function HomePage() {
  return (
    <main className="page">
      <section className="hero">
        <p className="eyebrow">Turborepo Starter</p>
        <h1>Next.js と Hono をまとめた monorepo 雛形</h1>
        <p className="lead">
          `apps/web` にフロントエンド、`apps/api` に API
          を配置した最小構成です。
        </p>
        <div className="actions">
          <a href="http://localhost:8787" target="_blank" rel="noreferrer">
            API を開く
          </a>
        </div>
      </section>
    </main>
  )
}
