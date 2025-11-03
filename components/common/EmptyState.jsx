export default function EmptyState({ title = "Nothing here", description = "" }) {
  return (
    <div className="p-8 text-center">
      <h2 className="text-lg font-semibold">{title}</h2>
      {description && <p className="text-sm mt-2 text-zinc-600 dark:text-zinc-400">{description}</p>}
    </div>
  );
}
