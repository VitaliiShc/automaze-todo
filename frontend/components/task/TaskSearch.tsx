export default function TaskSearch() {
  return (
    <div>
      <label htmlFor="task-search" className="visually-hidden">
        Search tasks
      </label>
      <input
        id="task-search"
        type="search"
        name="search"
        placeholder="Search tasks…"
        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200"
      />
    </div>
  );
}
