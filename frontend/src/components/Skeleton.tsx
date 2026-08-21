type SkeletonProps = {
  width?: string
  height?: string
}

export function Skeleton({ width = '100%', height = '1em' }: SkeletonProps) {
  return <div className="skeleton" style={{ width, height }} />
}
