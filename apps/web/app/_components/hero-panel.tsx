import type { TrendMetric } from "../_data/dashboard"

type HeroPanelProps = {
  metrics: TrendMetric[]
}

export function HeroPanel({ metrics }: HeroPanelProps) {
  return (
    <section className="rounded-[2rem] border border-base-300 bg-gradient-to-b to-black from-primary p-6 text-base-100 shadow-2xl">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.24em] text-info/80">
            Tech Focus
          </p>
          <h1 className="mt-4 text-4xl font-black leading-tight sm:text-5xl">
            知りたい技術を
            <br />
            必要な分だけ
            <br />
            キャッチアップ
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-base-100/70">
            あなたが追いたい技術の最新動向を、必要な分だけ、効率的にキャッチアップできるニュースダイジェストサービス。
          </p>
        </div>

        <div className="stats stats-vertical w-full max-w-md bg-base-100/10 text-base-100 shadow-none sm:stats-horizontal">
          {metrics.map((item) => (
            <div key={item.label} className="stat">
              <div className="stat-title text-base-100/60">{item.label}</div>
              <div className={`stat-value text-2xl ${item.tone}`}>
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
