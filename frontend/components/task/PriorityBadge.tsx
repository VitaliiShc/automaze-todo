import type { Priority } from "@/types/task";

type PriorityBadgeProps = {
  priority: Priority;
};

function getPriorityStyles(priority: Priority) {
  if (priority <= 3) {
    return "border-green-200 bg-green-100 text-green-700";
  }

  if (priority <= 7) {
    return "border-yellow-200 bg-yellow-100 text-yellow-700";
  }

  return "border-red-200 bg-red-100 text-red-700";
}

export default function PriorityBadge({ priority }: PriorityBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${getPriorityStyles(priority)}`}
    >
      Priority {priority}
    </span>
  );
}
