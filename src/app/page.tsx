import { Card } from "@/components/atoms/Card";
import { PrStateTag } from "@/components/atoms/PrStateTag";
import type { PrState } from "@/types/pull-request";

const previewStates: PrState[] = ["draft", "open", "merged", "closed"];

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center gap-6 px-4 py-16">
      <p className="font-mono text-data text-cyan-700">devflow-ai · v0.1 in progress</p>
      <h1 className="text-heading-xl text-balance">
        Every task, linked to its pull request.
      </h1>
      <p className="text-neutral-600">
        DevFlow AI is a task board for development teams. Each card shows the real state of its
        GitHub pull request, so nobody has to switch tools to know what is in review or already
        merged.
      </p>
      <Card className="flex flex-col gap-3">
        <span className="font-mono text-data text-neutral-600">Pull request states</span>
        <ul className="flex flex-wrap gap-2">
          {previewStates.map((state) => (
            <li key={state}>
              <PrStateTag state={state} />
            </li>
          ))}
        </ul>
      </Card>
    </main>
  );
}
