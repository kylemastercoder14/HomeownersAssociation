"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface HouseholdControlsProps {
  searchParams: {
    search?: string;
    status?: string;
    type?: string;
    page?: string;
    pageSize?: string;
  };
  totalPages: number;
  currentPage: number;
  totalCount: number;
  pageSize: number;
  isLoading?: boolean;
}

export function HouseholdControls({
  searchParams,
  totalPages,
  currentPage,
  totalCount,
  pageSize,
  isLoading = false,
}: HouseholdControlsProps) {
  const router = useRouter();

  const buildUrl = (params: Record<string, string>) => {
    const newParams = new URLSearchParams({
      ...searchParams,
      ...params,
    });
    return `/admin/household-registration?${newParams.toString()}`;
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    router.push(buildUrl({ pageSize: e.target.value, page: "1" }));
  };

  if (isLoading) {
    return <Skeleton className="h-10 w-32" />;
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">
          Page {currentPage} of {totalPages}
        </span>
        <select
          name="pageSize"
          className="border border-gray-300 h-9 px-3 rounded-md focus:ring-1 focus:ring-black focus:border-transparent"
          defaultValue={pageSize}
          onChange={handlePageSizeChange}
          disabled={isLoading}
        >
          <option value="5">5 per page</option>
          <option value="10">10 per page</option>
          <option value="20">20 per page</option>
          <option value="50">50 per page</option>
        </select>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-500">
            Showing {(currentPage - 1) * pageSize + 1} to{" "}
            {Math.min(currentPage * pageSize, totalCount)} of {totalCount}{" "}
            households
          </div>
          <div className="flex items-center gap-2">
            <Link
              href={buildUrl({ page: (currentPage - 1).toString() })}
              passHref
            >
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage <= 1 || isLoading}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
            </Link>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <Link
                    key={pageNum}
                    href={buildUrl({ page: pageNum.toString() })}
                    passHref
                  >
                    <Button
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      disabled={isLoading}
                    >
                      {pageNum}
                    </Button>
                  </Link>
                );
              })}
              {totalPages > 5 && currentPage < totalPages - 2 && (
                <span className="px-2">...</span>
              )}
              {totalPages > 5 && currentPage < totalPages - 2 && (
                <Link href={buildUrl({ page: totalPages.toString() })} passHref>
                  <Button variant="outline" size="sm" disabled={isLoading}>
                    {totalPages}
                  </Button>
                </Link>
              )}
            </div>
            <Link
              href={buildUrl({ page: (currentPage + 1).toString() })}
              passHref
            >
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= totalPages || isLoading}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
