import { cn } from "@/lib/utils"

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("bg-gray-200 animate-pulse rounded-md", className)}
      {...props}
    />
  )
}

export { Skeleton }