const FILTERS = ["All", "Done", "Undone"] as const;

export default function TaskFilters() {
  return (
    <fieldset className="flex items-center gap-2">
      <legend className="visually-hidden">Filter tasks by status</legend>
      <div className="inline-flex rounded-lg border border-gray-300 bg-white p-1">
        {FILTERS.map((label, index) => (
          <button
            key={label}
            type="button"
            aria-pressed={index === 0}
            className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 aria-pressed:bg-gray-900 aria-pressed:text-white"
          >
            {label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
