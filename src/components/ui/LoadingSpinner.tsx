export function LoadingSpinner() {
  return (
    <div className="grid min-h-screen place-items-center bg-[#f8faf7]">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-stone-200 border-t-moss" />
    </div>
  );
}
