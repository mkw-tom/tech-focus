import { AuthViewClient } from "../../_components/auth-view"
import { InfoCard } from "../../_components/info-card"
import { isNeonAuthConfigured } from "../../_lib/auth-config"

type AuthPageProps = {
  params: Promise<{
    path: string
  }>
}

export const dynamic = "force-dynamic"

export default async function AuthPage({ params }: AuthPageProps) {
  const { path } = await params

  if (!isNeonAuthConfigured) {
    return (
      <main className="mx-auto flex min-h-screen max-w-2xl items-center px-4 py-8">
        <InfoCard title="Neon Auth">
          <p className="text-sm leading-7 text-base-content/70">
            `NEON_AUTH_BASE_URL` と `NEON_AUTH_COOKIE_SECRET` を設定すると、
            認証画面が有効になります。
          </p>
        </InfoCard>
      </main>
    )
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-4 py-8">
      <AuthViewClient path={path} />
    </main>
  )
}
