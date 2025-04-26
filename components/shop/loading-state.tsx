export function LoadingState() {
  return (
    <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="h-[300px] rounded-lg bg-gray-100 animate-pulse"
        />
      ))}
    </div>
  );
}
