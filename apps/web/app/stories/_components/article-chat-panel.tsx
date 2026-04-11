import { MdSend } from "react-icons/md"

type ArticleChatPanelProps = {
  keyPoints: string[]
}

function ChatBody({ keyPoints }: ArticleChatPanelProps) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="space-y-3 overflow-y-auto pr-1">
        <div className="chat chat-end">
          <div className="chat-bubble chat-bubble-primary">
            この記事の要点を3つにまとめて
          </div>
        </div>
        <div className="chat chat-start">
          <div className="chat-bubble">
            1. {keyPoints[0]}
            <br />
            2. {keyPoints[1]}
            <br />
            3. {keyPoints[2]}
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 mt-4 border-t border-base-300 bg-base-100 pt-4">
        <label className="input input-bordered flex items-center gap-3 rounded-2xl">
          <input
            type="text"
            className="grow"
            placeholder="この記事について質問する"
          />
          <button
            type="button"
            className="btn btn-primary btn-sm bg-primary px-2 text-white"
          >
            <MdSend className="h-4 w-4" />
          </button>
        </label>
      </div>
    </div>
  )
}

export function ArticleChatPanel({ keyPoints }: ArticleChatPanelProps) {
  return (
    <>
      <section className="hidden lg:block">
        <div className="card border border-base-300 bg-base-100 shadow-sm">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <h2 className="card-title">記事についてAI質問</h2>
              <div className="badge badge-accent">Preview</div>
            </div>
            <div className="h-[28rem] rounded-[1.5rem] border border-base-300 bg-base-100 p-4">
              <ChatBody keyPoints={keyPoints} />
            </div>
          </div>
        </div>
      </section>

      <details className="fixed inset-x-4 bottom-4 z-40 lg:hidden">
        <summary className="flex list-none items-center justify-between rounded-full border border-base-300 bg-base-100/95 px-4 py-3 shadow-2xl backdrop-blur marker:hidden">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.22em] text-base-content/45">
              CTX
            </p>
            <p className="truncate text-sm font-semibold">記事についてAI質問</p>
          </div>
          <span className="btn btn-primary btn-sm rounded-full px-4">開く</span>
        </summary>

        <div className="mt-3 rounded-[2rem] border border-base-300 bg-base-100 p-4 shadow-2xl">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold">CTX AI Chat</p>
            <div className="flex items-center gap-2">
              <div className="badge badge-accent">Preview</div>
              <span className="text-xs text-base-content/45">
                下にスワイプして閉じる
              </span>
            </div>
          </div>
          <div className="h-[min(60vh,32rem)] rounded-[1.5rem] border border-base-300 bg-base-100 p-4">
            <ChatBody keyPoints={keyPoints} />
          </div>
        </div>
      </details>
    </>
  )
}
