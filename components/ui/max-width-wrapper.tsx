import * as React from "react"

import { cn } from "@/lib/utils"

interface MaxWidthWrapperProps extends React.ComponentProps<"div"> {
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "4xl" | "5xl" | "6xl" | "7xl" | "full"
}

const maxWidthClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl",
  "6xl": "max-w-6xl",
  "7xl": "max-w-7xl",
  full: "max-w-full",
}

function MaxWidthWrapper({
  className,
  maxWidth = "7xl",
  ...props
}: MaxWidthWrapperProps) {
  return (
    <div
      data-slot="max-width-wrapper"
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        maxWidthClasses[maxWidth],
        className
      )}
      {...props}
    />
  )
}

export { MaxWidthWrapper }

