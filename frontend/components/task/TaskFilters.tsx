import type { StatusFilter } from "@/types/task";

const FILTERS: { label: string; value: StatusFilter }[] = [
  { label: "All", value: "all" },
  { label: "Done", value: "done" },
  { label: "Undone", value: "undone" },
];

type TaskFiltersProps = {
  value: StatusFilter;
  onChange: (value: StatusFilter) => void;
};

export default function TaskFilters({ value, onChange }: TaskFiltersProps) {
  return (
    <fieldset className="flex items-center gap-2">
      <legend className="visually-hidden">Filter tasks by status</legend>
      <div className="inline-flex rounded-lg border border-gray-300 bg-white p-1">
        {FILTERS.map((filter) => (
          <button
            key={filter.value}
            type="button"
            aria-pressed={value === filter.value}
            onClick={() => onChange(filter.value)}
            className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 aria-pressed:bg-gray-900 aria-pressed:text-white"
          >
            {filter.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
