export default function Loading({ label = "Loading...", fullscreen = false, backdrop = false, className = "" }) {
  if (fullscreen) {
    return (
      <div className={`fixed inset-0 z-50 ${backdrop ? "bg-black/5 backdrop-blur-[1px]" : ""} grid place-items-center min-h-screen`}>
        <div className="loader" role="status" aria-label="Loading" />
        <span className="sr-only">{label}</span>
      </div>
    );
  }

  return (
    <div className={`w-full h-full min-h-[200px] grid place-items-center ${className}`}>
      <div className="loader" role="status" aria-label="Loading" />
      <span className="sr-only">{label}</span>
    </div>
  );
}