import type { InputHTMLAttributes } from "react";

type LabeledInputProps = {
  label: string;
} & InputHTMLAttributes<HTMLInputElement>;

export function LabeledInput({ label, ...props }: LabeledInputProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-stone-700">{label}</span>
      <input className="focus-ring h-11 w-full rounded-md border border-stone-300 bg-white px-3" {...props} />
    </label>
  );
}
