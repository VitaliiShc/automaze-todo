export default function TaskList() {
  return (
    <ul
      aria-label="Tasks"
      className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center"
    >
      <li className="list-none text-sm text-gray-500">
        No tasks yet. Add your first task below.
      </li>
    </ul>
  );
}
