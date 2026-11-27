import { en } from "@/content/demo/en";
import { es } from "@/content/demo/es";
import { createDemoUseCases } from "@/infrastructure/demo-use-cases";

const titlesIn = (tasks: { title: string; status: string; position: number }[], status: string) =>
  tasks
    .filter((task) => task.status === status)
    .sort((first, second) => first.position - second.position)
    .map((task) => task.title);

describe("demo use cases", () => {
  it("starts with the sample tasks ordered inside each column and linked to the real pull requests", () => {
    const { initialTasks } = createDemoUseCases(es);

    expect(titlesIn(initialTasks, "TODO")).toEqual(["Modo demo", "Test E2E y release v0.1"]);
    expect(initialTasks.find((task) => task.title === "Arrastrar y soltar accesible")?.pullRequest).toMatchObject({
      url: "https://github.com/elianisdev/devflow-ai/pull/15",
      state: "open",
    });
  });

  it("offers the same sample board in both languages", () => {
    const shape = (tasks: typeof en) => tasks.map(({ status, pullRequest }) => [status, pullRequest?.number]);

    expect(shape(en)).toEqual(shape(es));
  });

  it("creates, moves, unlinks and deletes tasks only in memory", async () => {
    const fetchSpy = jest.fn();
    global.fetch = fetchSpy;
    const demo = createDemoUseCases(en);

    const created = await demo.createTask({ title: "Try the demo", description: "" });
    if (!created.success) throw new Error("Task should be created");
    await demo.moveTask(created.task.id, "IN_REVIEW", 0);
    await demo.unlinkPullRequest("demo-5");
    await demo.deleteTask("demo-1");
    const tasks = await demo.listTasks();

    expect(titlesIn(tasks, "IN_REVIEW")).toEqual(["Try the demo", "Accessible drag and drop"]);
    expect(tasks.find((task) => task.id === "demo-5")?.pullRequest).toBeNull();
    expect(tasks.some((task) => task.id === "demo-1")).toBe(false);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("keeps each demo independent, so a reload starts over", async () => {
    const first = createDemoUseCases(en);
    await first.deleteTask("demo-1");

    const second = createDemoUseCases(en);

    expect(await second.listTasks()).toHaveLength(en.length);
  });
});
