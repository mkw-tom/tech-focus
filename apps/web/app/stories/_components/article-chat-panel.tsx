"use client"

import { useState } from "react"
import { MdClose, MdOpenInFull, MdSend } from "react-icons/md"

type ArticleChatPanelProps = {
  keyPoints: string[]
}

type ComposerProps = {
  compact?: boolean
  onChange: (value: string) => void
  onExpand?: () => void
  onSubmit: () => void
  value: string
}

function Composer({
  compact = false,
  onChange,
  onExpand,
  onSubmit,
  value,
}: ComposerProps) {
  return (
    <div
      className={`flex w-full items-center gap-2 rounded-[1.6rem] bg-gradient-to-r from-base-100/95 via-base-100/82 to-base-100/72 shadow-[0_14px_40px_-22px_rgba(15,23,42,0.45),inset_0_1px_0_rgba(255,255,255,0.28)] backdrop-blur-xl ${
        compact ? "px-3 py-2" : "px-3 py-3 sm:px-4"
      }`}
    >
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-w-0 flex-1 bg-transparent px-1 text-sm outline-none placeholder:text-base-content/45 sm:text-base"
        placeholder="この記事について質問する"
      />
      {compact && onExpand ? (
        <button
          type="button"
          onClick={onExpand}
          className="btn btn-ghost btn-sm btn-circle shrink-0 bg-base-100/55 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] hover:bg-base-100/75"
          aria-label="CTXを開く"
        >
          <MdOpenInFull className="h-4 w-4" />
        </button>
      ) : null}
      <button
        type="button"
        onClick={onSubmit}
        className={`btn btn-primary shrink-0 rounded-xl ${
          compact ? "btn-sm px-3" : "btn-md px-3 sm:btn-sm sm:px-2"
        }`}
        aria-label="質問を送信"
      >
        <MdSend className="h-4 w-4" />
      </button>
    </div>
  )
}

type ChatBodyProps = {
  draft: string
  keyPoints: string[]
  onChange: (value: string) => void
  onClose: () => void
  onSubmit: () => void
}

function ChatBody({
  draft,
  keyPoints,
  onChange,
  onClose,
  onSubmit,
}: ChatBodyProps) {
  const prompt = draft.trim() || "この記事の要点を3つにまとめて"

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.22em] text-base-content/45">
            CTX
          </p>
          <p className="truncate text-sm font-semibold">記事についてAI質問</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="badge badge-accent">Preview</div>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-ghost btn-sm btn-circle bg-base-100/55 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] hover:bg-base-100/75"
            aria-label="CTXを閉じる"
          >
            <MdClose className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
        <div className="chat chat-end">
          <div className="chat-bubble chat-bubble-primary">{prompt}</div>
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

      <div className="sticky bottom-0 mt-4 bg-gradient-to-t from-base-100 via-base-100/86 to-transparent pt-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md">
        <Composer value={draft} onChange={onChange} onSubmit={onSubmit} />
      </div>
    </div>
  )
}

export function ArticleChatPanel({ keyPoints }: ArticleChatPanelProps) {
  const [draft, setDraft] = useState("")
  const [isExpanded, setIsExpanded] = useState(false)

  const handleSubmit = () => {
    setIsExpanded(true)
  }

  return (
    <>
      <section className="hidden lg:block">
        <div className="space-y-3">
          {!isExpanded ? (
            <div className="rounded-[1.9rem] bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.24),transparent_38%),linear-gradient(135deg,rgba(255,255,255,0.14),rgba(255,255,255,0.04))] bg-base-100/55 p-3 shadow-[0_24px_60px_-32px_rgba(15,23,42,0.55),inset_0_1px_0_rgba(255,255,255,0.22)] backdrop-blur-2xl">
              <div className="mb-3 flex items-center justify-between gap-3 px-1">
                <div className="min-w-0">
                  <p className="text-[11px] uppercase tracking-[0.22em] text-base-content/45">
                    CTX
                  </p>
                  <p className="truncate text-sm font-semibold">
                    そのまま質問して展開
                  </p>
                </div>
                <div className="badge badge-accent">Preview</div>
              </div>
              <Composer
                compact
                value={draft}
                onChange={setDraft}
                onExpand={() => setIsExpanded(true)}
                onSubmit={handleSubmit}
              />
            </div>
          ) : (
            <div className="rounded-[2rem] bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.22),transparent_34%),linear-gradient(145deg,rgba(255,255,255,0.14),rgba(255,255,255,0.05))] bg-base-100/58 p-4 shadow-[0_28px_80px_-38px_rgba(15,23,42,0.62),inset_0_1px_0_rgba(255,255,255,0.22)] backdrop-blur-2xl">
              <div className="h-[24rem] rounded-[1.7rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.15),rgba(255,255,255,0.03))] bg-base-100/42 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-12px_24px_rgba(15,23,42,0.08)] backdrop-blur-md">
                <ChatBody
                  draft={draft}
                  keyPoints={keyPoints}
                  onChange={setDraft}
                  onClose={() => setIsExpanded(false)}
                  onSubmit={handleSubmit}
                />
              </div>
            </div>
          )}
        </div>
      </section>

      <div className="fixed inset-x-3 bottom-3 z-40 lg:hidden">
        {!isExpanded ? (
          <div className="rounded-[1.8rem] bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.24),transparent_34%),linear-gradient(145deg,rgba(255,255,255,0.16),rgba(255,255,255,0.05))] bg-base-100/68 p-3 shadow-[0_24px_70px_-32px_rgba(15,23,42,0.62),inset_0_1px_0_rgba(255,255,255,0.24)] backdrop-blur-2xl">
            <div className="mb-3 flex items-center justify-between gap-3 px-1">
              <div className="min-w-0">
                <p className="text-[11px] uppercase tracking-[0.22em] text-base-content/45">
                  CTX
                </p>
                <p className="truncate text-sm font-semibold">
                  AI にそのまま質問
                </p>
              </div>
              <div className="badge badge-accent">Preview</div>
            </div>
            <Composer
              compact
              value={draft}
              onChange={setDraft}
              onExpand={() => setIsExpanded(true)}
              onSubmit={handleSubmit}
            />
          </div>
        ) : (
          <div className="rounded-[1.8rem] bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.24),transparent_34%),linear-gradient(145deg,rgba(255,255,255,0.16),rgba(255,255,255,0.05))] bg-base-100/66 p-3 shadow-[0_26px_72px_-34px_rgba(15,23,42,0.65),inset_0_1px_0_rgba(255,255,255,0.24)] backdrop-blur-2xl">
            <div className="h-[min(68vh,32rem)] rounded-[1.6rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.14),rgba(255,255,255,0.03))] bg-base-100/42 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.2),inset_0_-12px_24px_rgba(15,23,42,0.08)] backdrop-blur-md">
              <ChatBody
                draft={draft}
                keyPoints={keyPoints}
                onChange={setDraft}
                onClose={() => setIsExpanded(false)}
                onSubmit={handleSubmit}
              />
            </div>
          </div>
        )}
      </div>
    </>
  )
}
