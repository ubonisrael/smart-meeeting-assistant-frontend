export function StatusDot({ status }: { status: string }) {
  const color = status === "completed" ? "bg-moss" : status === "failed" ? "bg-coral" : "bg-wheat";
  return <span className={`h-2.5 w-2.5 rounded-full ${color}`} />;
}
