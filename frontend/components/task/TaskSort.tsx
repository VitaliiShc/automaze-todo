import type { SortOrder } from "@/types/task";

type TaskSortProps = {
  value: SortOrder;
  onChange: (value: SortOrder) => void;
};

export default function TaskSort({ value, onChange }: TaskSortProps) {
  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor="task-sort"
        className="whitespace-nowrap text-sm font-medium text-gray-600"
      >
        Sort by priority
      </label>
      <select
        id="task-sort"
        name="sort"
        value={value}
        onChange={(event) => onChange(event.target.value as SortOrder)}
        className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200"
      >
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </div>
  );
}
