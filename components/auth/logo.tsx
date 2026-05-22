export function Logo() {
  return (
    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#2563EB]">
      <svg
        viewBox="0 0 32 32"
        className="h-9 w-9 text-white"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M4 14h4v4H4zM24 14h4v4h-4z" fill="currentColor" stroke="none" />
        <path d="M8 16h16" />
        <path d="M10 12v8M22 12v8" />
        <path d="M14 20l2-8 2 8" />
      </svg>
    </div>
  )
}
