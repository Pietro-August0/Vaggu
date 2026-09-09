import { Link } from "react-router-dom"

import { cn } from "@/lib/utils"

export function Brand({
  className,
  inverted = false,
}: {
  className?: string
  inverted?: boolean
}) {
  return (
    <Link
      aria-label="VAGGU — página inicial"
      className={cn("inline-flex h-10", className)}
      to="/"
    >
      <img
        alt=""
        aria-hidden="true"
        className="block h-full w-auto object-contain"
        src={inverted ? "/assets/vaggu-logo-white.svg" : "/assets/vaggu-logo.svg"}
      />
      <span className="sr-only">VAGGU</span>
    </Link>
  )
}
