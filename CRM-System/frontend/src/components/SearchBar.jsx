export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative flex items-center bg-black/35 border border-white/5 rounded-xl px-4 py-2.5 transition-all duration-300 focus-within:border-cyan-400/40 focus-within:shadow-[0_0_15px_rgba(34,211,238,0.1)]">
      <span className="material-symbols-outlined text-[#bbc9cd]/60 select-none text-[20px]">search</span>
      <input
        type="text"
        placeholder="Search tickets by subject, description, name..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-sm text-[#dde4e5] w-full ml-3 placeholder-[#bbc9cd]/30"
      />
    </div>
  )
}
