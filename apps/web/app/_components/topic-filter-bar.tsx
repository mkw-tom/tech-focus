import { FaArrowTrendUp } from "react-icons/fa6"
import { GrUpdate } from "react-icons/gr"
import { MdOutlineTroubleshoot } from "react-icons/md"
import type { Topic } from "../_data/dashboard"

type TopicFilterBarProps = {
  items: Topic[]
  activeId?: string
  onSelect?: (id: string) => void
}

export function TopicFilterBar({
  items,
  activeId,
  onSelect,
}: TopicFilterBarProps) {
  const itemIcon = (itemLabel: string) => {
    switch (itemLabel) {
      case "アップデート":
        return <GrUpdate className="text-sm" />
      case "インシデント":
        return <MdOutlineTroubleshoot className="text-[18px]" />
      case "トレンド":
        return <FaArrowTrendUp className="text-[18px]" />
      default:
        return null
    }
  }
  return (
    <section className="border-b border-base-300">
      <div className="flex flex-wrap gap-6">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`relative -mb-px border-b-2 pb-3 text-sm font-semibold transition flex items-center ${
              (activeId ? item.id === activeId : item.active)
                ? "border-primary text-primary"
                : "border-transparent text-base-content/55 hover:border-base-300 hover:text-base-content"
            }`}
            onClick={() => onSelect?.(item.id)}
          >
            {itemIcon(item.label)}
            <span className="ml-2">{item.label}</span>
          </button>
        ))}
      </div>
    </section>
  )
}
