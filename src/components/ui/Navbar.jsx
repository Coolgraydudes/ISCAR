export default function Navbar() {
  return (
    <div
      className="fixed top-5 left-1/2 -translate-x-1/2 z-20 flex gap-3">
      <button className="px-4 py-2 rounded-lg text-sm text-white bg-black/60">
        Overview
      </button>

      <button className="px-4 py-2 rounded-lg text-sm text-white bg-black/60">
        Mode
      </button>

      <button className="px-4 py-2 rounded-lg text-sm text-white bg-black/60">
        Reset
      </button>
    </div>
  );
}
