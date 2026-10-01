export default function Loading() {
  return (
    <main className="min-h-dvh px-4 pt-20">
      <div className="mx-auto flex max-w-3xl flex-col gap-3">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-foreground/5" style={{ animationDelay: `${i * 120}ms` }} />
          ))}
        </div>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-2xl bg-foreground/5" style={{ animationDelay: `${i * 120}ms` }} />
        ))}
      </div>
    </main>
  );
}
