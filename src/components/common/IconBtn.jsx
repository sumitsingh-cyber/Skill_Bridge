export default function IconBtn({
  text,
  onClick,
  children,
  disabled,
  outline = false,
  customClasses,
  type 
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`
        group inline-flex items-center gap-2
        rounded-lg px-5 py-2
        font-semibold
        transition-all duration-300 ease-out

        ${
          outline
            ? `
              border border-cyan-400/60
              text-cyan-300
              bg-transparent
              hover:bg-cyan-400/10
              hover:border-cyan-400
              hover:shadow-[0_0_12px_rgba(34,211,238,0.25)]
            `
            : `
              bg-yellow-400
              text-gray-900
              hover:bg-white
              hover:shadow-[0_4px_16px_rgba(255,255,255,0.25)]
            `
        }

        ${
          disabled
            ? "cursor-not-allowed opacity-50 hover:shadow-none"
            : "cursor-pointer active:scale-[0.97]"
        }

        ${customClasses}
      `}
    >
      {children ? (
        <>
          <span>{text}</span>
          <span className="group-hover:translate-x-0.5 transition-transform">
            {children}
          </span>
        </>
      ) : (
        <span>{text}</span>
      )}
    </button>
  )
}
