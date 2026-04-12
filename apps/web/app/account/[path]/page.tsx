import { redirect } from "next/navigation"
import { AccountViewClient } from "../../_components/account-view"
import { InfoCard } from "../../_components/info-card"
import { auth } from "../../_lib/auth"
import { isNeonAuthConfigured } from "../../_lib/auth-config"

type AccountPageProps = {
  params: Promise<{
    path: string
  }>
}

export const dynamic = "force-dynamic"

export default async function AccountPage({ params }: AccountPageProps) {
  const { path } = await params

  if (!isNeonAuthConfigured) {
    return (
      <main className="mx-auto flex min-h-screen max-w-2xl items-center px-4 py-8">
        <InfoCard title="Neon Auth">
          <p className="text-sm leading-7 text-base-content/70">
            先に Neon Auth の環境変数を設定してください。
          </p>
        </InfoCard>
      </main>
    )
  }

  const session = auth ? (await auth.getSession()).data : null

  if (!session?.user) {
    redirect("/auth/sign-in")
  }

  return (
    <main className="mx-auto min-h-screen max-w-4xl px-4 py-8">
      <AccountViewClient path={path} />
    </main>
  )
}
