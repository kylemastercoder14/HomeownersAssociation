import { Skeleton } from "@/components/ui/skeleton";

export function HouseholdSkeleton() {
  return (
    <div className="min-h-screen">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between h-16">
        <div className="flex items-center space-x-3">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <div>
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <Skeleton className="h-10 w-36" />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 mt-3 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-6 rounded-lg border">
            <div className="flex items-center">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="ml-4">
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-8 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Card Skeleton */}
      <div className="mb-6 p-6 rounded-lg border">
        <Skeleton className="h-6 w-48 mb-4" />
        <div className="flex flex-col sm:flex-row gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="p-6 rounded-lg border">
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-8 gap-4">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-6" />
            ))}
          </div>

          {[...Array(5)].map((_, i) => (
            <div key={i} className="grid grid-cols-8 gap-4 pt-4">
              {[...Array(8)].map((_, j) => (
                <Skeleton key={j} className="h-12" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
