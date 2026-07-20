import TaskSearch from "@/components/task/TaskSearch";
import TaskFilters from "@/components/task/TaskFilters";
import TaskSort from "@/components/task/TaskSort";
import TaskList from "@/components/task/TaskList";
import TaskForm from "@/components/task/TaskForm";

export default function Home() {
  return (
    <main className="flex flex-1 justify-center bg-gray-50 px-4 py-10 sm:py-16">
      <div className="flex w-full max-w-175 flex-col gap-8">
        <header className="text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
            TODO App
          </h1>
        </header>

        <section aria-label="Search and filters" className="flex flex-col gap-4">
          <TaskSearch />
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <TaskFilters />
            <TaskSort />
          </div>
        </section>

        <section aria-label="Tasks">
          <TaskList />
        </section>

        <section aria-label="Add a new task">
          <TaskForm />
        </section>
      </div>
    </main>
  );
}
