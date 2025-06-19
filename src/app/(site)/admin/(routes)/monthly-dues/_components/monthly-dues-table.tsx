/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo } from "react";
import { format } from "date-fns";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowUpDown,
  ChevronDown,
  Plus,
  Wallet,
  Calendar,
  Home,
  Users,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CellAction } from './cell-action';
import { useRouter } from 'next/navigation';

// Type definitions based on your Prisma models
type DueWithRelations = {
  id: string;
  amount: number;
  dueDate: Date;
  status: "UNPAID" | "PARTIAL" | "PAID" | "OVERDUE" | "WAIVED";
  type: "MONTHLY_DUES" | "WATER_BILL" | "ELECTRICITY" | "SPECIAL_ASSESSMENT" | "ARREARAGES" | "PENALTY";
  description?: string;
  fiscalMonth: number;
  fiscalYear: number;
  lateFee: number;
  meterReading?: number;
  previousReading?: number;
  createdAt: Date;
  updatedAt: Date;
  household: {
    id: string;
    block: string;
    lot: string;
    type: string;
    status: string;
    address: string;
    seniorCitizenCount: number;
    pwdCount: number;
    soloParentCount: number;
    head: {
      id: string;
      firstName: string;
      lastName: string;
      email?: string;
      phone?: string;
    };
  };
  payments: {
    id: string;
    amount: number;
    paymentDate: Date;
    paymentMethod: string;
    referenceNo?: string;
    receivedBy?: string;
  }[];
};

interface MonthlyDuesTableProps {
  data: DueWithRelations[];
}

export function MonthlyDuesTable({ data }: MonthlyDuesTableProps) {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");

  // Status color mapping
  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-800 border-green-200";
      case "UNPAID":
        return "bg-red-100 text-red-800 border-red-200";
      case "PARTIAL":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "OVERDUE":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "WAIVED":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Type icon mapping
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "WATER_BILL":
        return "💧";
      case "ELECTRICITY":
        return "⚡";
      case "MONTHLY_DUES":
        return "🏠";
      case "SPECIAL_ASSESSMENT":
        return "📋";
      case "ARREARAGES":
        return "📊";
      case "PENALTY":
        return "⚠️";
      default:
        return "💰";
    }
  };

  // Calculate totals
  const totals = useMemo(() => {
    const totalAmount = data.reduce((sum, due) => sum + due.amount + due.lateFee, 0);
    const totalPaid = data.reduce((sum, due) => {
      const paidAmount = due.payments.reduce((paidSum, payment) => paidSum + payment.amount, 0);
      return sum + paidAmount;
    }, 0);
    const totalUnpaid = totalAmount - totalPaid;
    const overdueCount = data.filter(due => due.status === "OVERDUE").length;

    return { totalAmount, totalPaid, totalUnpaid, overdueCount };
  }, [data]);

  const columns: ColumnDef<DueWithRelations>[] = [
    {
      accessorKey: "household.address",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2"
        >
          <Home className="h-4 w-4" />
          Household
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const household = row.original.household;
        return (
          <div className="space-y-1">
            <div className="font-medium">{household.address}</div>
            <div className="text-sm text-gray-500">
              Block {household.block}, Lot {household.lot}
            </div>
            <div className="text-sm text-gray-500">
              {household.head.firstName} {household.head.lastName}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => {
        const type = row.getValue("type") as string;
        return (
          <div className="flex items-center gap-2">
            <span>{getTypeIcon(type)}</span>
            <span className="font-medium">
              {type.replace(/_/g, " ")}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "fiscalMonth",
      header: "Period",
      cell: ({ row }) => {
        const month = row.getValue("fiscalMonth") as number;
        const year = row.original.fiscalYear;
        const monthName = new Date(2000, month - 1, 1).toLocaleString("default", {
          month: "long",
        });
        return (
          <div>
            <div className="font-medium">{monthName}</div>
            <div className="text-sm text-gray-500">{year}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "amount",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2"
        >
          Amount
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const amount = row.getValue("amount") as number;
        const lateFee = row.original.lateFee;
        const total = amount + lateFee;

        return (
          <div className="space-y-1">
            <div className="font-medium">₱{total.toLocaleString()}</div>
            {lateFee > 0 && (
              <div className="text-sm text-red-600">
                +₱{lateFee.toLocaleString()} late fee
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "payments",
      header: "Paid Amount",
      cell: ({ row }) => {
        const payments = row.getValue("payments") as any[];
        const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);
        const totalDue = row.original.amount + row.original.lateFee;
        const balance = totalDue - totalPaid;

        return (
          <div className="space-y-1">
            <div className="font-medium text-green-600">
              ₱{totalPaid.toLocaleString()}
            </div>
            {balance > 0 && (
              <div className="text-sm text-red-600">
                Balance: ₱{balance.toLocaleString()}
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge className={cn("font-medium", getStatusColor(status))}>
            {status.replace(/_/g, " ")}
          </Badge>
        );
      },
    },
    {
      accessorKey: "dueDate",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-8 px-2"
        >
          <Calendar className="h-4 w-4" />
          Due Date
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const date = row.getValue("dueDate") as Date;
        const isOverdue = new Date() > date && row.original.status !== "PAID";

        return (
          <div className={cn("", isOverdue && "text-red-600")}>
            <div className="font-medium">{format(date, "MMM dd")}</div>
            <div className="text-sm text-gray-500">{format(date, "yyyy")}</div>
            {isOverdue && (
              <div className="text-xs text-red-600 flex items-center justify-center gap-1 mt-1">
                <AlertCircle className="h-3 w-3" />
                Overdue
              </div>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "household.type",
      header: "Property Type",
      cell: ({ row }) => {
        const type = row.original.household.type;
        return (
          <Badge variant="outline" className="font-medium">
            {type}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <CellAction id={row.original.id} />
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  });

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₱{totals.totalAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All dues combined</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">₱{totals.totalPaid.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Collected payments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">₱{totals.totalUnpaid.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Unpaid balance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <Users className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{totals.overdueCount}</div>
            <p className="text-xs text-muted-foreground">Overdue accounts</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Dues Management</CardTitle>
          <CardDescription>
            Comprehensive view of all monthly dues with filtering and management options
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1">
              <Input
                placeholder="Search households, addresses, or names..."
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="max-w-sm"
              />
            </div>

            <Select
              value={(table.getColumn("status")?.getFilterValue() as string) ?? ""}
              onValueChange={(value) =>
                table.getColumn("status")?.setFilterValue(value === "all" ? "" : value)
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="UNPAID">Unpaid</SelectItem>
                <SelectItem value="PARTIAL">Partial</SelectItem>
                <SelectItem value="PAID">Paid</SelectItem>
                <SelectItem value="OVERDUE">Overdue</SelectItem>
                <SelectItem value="WAIVED">Waived</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={(table.getColumn("type")?.getFilterValue() as string) ?? ""}
              onValueChange={(value) =>
                table.getColumn("type")?.setFilterValue(value === "all" ? "" : value)
              }
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="MONTHLY_DUES">Monthly Dues</SelectItem>
                <SelectItem value="WATER_BILL">Water Bill</SelectItem>
                <SelectItem value="ELECTRICITY">Electricity</SelectItem>
                <SelectItem value="SPECIAL_ASSESSMENT">Special Assessment</SelectItem>
                <SelectItem value="ARREARAGES">Arrearages</SelectItem>
                <SelectItem value="PENALTY">Penalty</SelectItem>
              </SelectContent>
            </Select>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  <ChevronDown className="h-4 w-4" />
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button onClick={() => router.push("/admin/monthly-dues/create")}>
              <Plus className="h-4 w-4" />
              Add Due
            </Button>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      className="hover:bg-gray-50"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      No results found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">Rows per page</p>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value));
                }}
              >
                <SelectTrigger className="h-8 w-[70px]">
                  <SelectValue placeholder={table.getState().pagination.pageSize} />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
