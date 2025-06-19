"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface HouseholdFiltersProps {
  searchParams: {
    search?: string;
    status?: string;
    type?: string;
  };
}

export function HouseholdFilters({ searchParams }: HouseholdFiltersProps) {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const params = new URLSearchParams();

    if (formData.get("search")) params.set("search", formData.get("search") as string);
    if (formData.get("status")) params.set("status", formData.get("status") as string);
    if (formData.get("type")) params.set("type", formData.get("type") as string);
    params.set("page", "1");

    router.push(`/admin/household-registration?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            name="search"
            placeholder="Search by address, block, or lot..."
            className="pl-10"
            defaultValue={searchParams.search || ""}
          />
        </div>
        <select
          name="status"
          className="border border-gray-300 h-9 px-3 rounded-md focus:ring-1 focus:ring-black focus:border-transparent"
          defaultValue={searchParams.status || ""}
        >
          <option value="">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Vacant">Vacant</option>
        </select>
        <select
          name="type"
          className="border border-gray-300 h-9 px-3 rounded-md focus:ring-1 focus:ring-black focus:border-transparent"
          defaultValue={searchParams.type || ""}
        >
          <option value="">All Types</option>
          <option value="Owned">Owned</option>
          <option value="Rented">Rented</option>
        </select>
        <Button type="submit">Apply Filters</Button>
      </div>
    </form>
  );
}
