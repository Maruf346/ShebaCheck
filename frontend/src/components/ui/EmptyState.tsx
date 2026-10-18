import { Inbox } from "lucide-react";
import { Button } from "./Button";

export function EmptyState({ title, body, action }: { title: string; body: string; action: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-warm-200 bg-warm-50 p-8 text-center">
      <Inbox className="mx-auto h-8 w-8 text-warm-500" aria-hidden="true" />
      <h3 className="mt-4 text-base font-bold text-warm-900">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-warm-600">{body}</p>
      <Button className="mt-5" variant="secondary">
        {action}
      </Button>
    </div>
  );
}
