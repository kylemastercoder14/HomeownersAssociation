"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import {
  CalendarIcon,
  Calculator,
  FileText,
  Clock,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Due, Household, Payment } from "@prisma/client";
import { DueFormSchema, DueFormValues } from "@/validators/dues";
import { handleDueFormSubmit } from "@/actions/monthly-dues";
import { toast } from "sonner";
import { useRouter } from 'next/navigation';

interface DueWithProps extends Due {
  payments: Payment[];
}

interface DueFormProps {
  initialData?: DueWithProps | null;
  households: Household[];
}

export const DueForm = ({ initialData, households }: DueFormProps) => {
  const router = useRouter();
  const form = useForm<DueFormValues>({
    resolver: zodResolver(DueFormSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          description: initialData.description ?? undefined,
          type: initialData.type ?? "MONTHLY_DUES",
          meterReading: initialData.meterReading ?? undefined,
          previousReading: initialData.previousReading ?? undefined,
        }
      : {
          householdId: "",
          amount: 0,
          dueDate: new Date(),
          fiscalMonth: new Date().getMonth() + 1,
          fiscalYear: new Date().getFullYear(),
          description: "",
          status: "UNPAID",
          lateFee: 0,
          type: "MONTHLY_DUES",
        },
  });

  const { isSubmitting: isLoading } = form.formState;
  const selectedType = form.watch("type");
  const currentMeterReading = form.watch("meterReading");
  const previousMeterReading = form.watch("previousReading");

  // Calculate water consumption if both readings are available
  const waterConsumption =
    currentMeterReading && previousMeterReading
      ? currentMeterReading - previousMeterReading
      : 0;

  const onSubmit = async (data: DueFormValues) => {
    try {
      const result = await handleDueFormSubmit(
        data,
        initialData ? { id: initialData.id } : null
      );

      if (!result.success) {
        console.error(result.message);
        toast.error(result.message);
        return;
      }

      toast.success(
        initialData
          ? "Monthly dues updated successfully"
          : "Monthly dues created successfully"
      );
      router.push("/admin/monthly-dues");

    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-0 border-none shadow-none ">
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Basic Information */}
              <Card className="mt-3">
                <CardHeader>
                  <CardTitle className="text-lg">Basic Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Household Selection */}
                    <FormField
                      control={form.control}
                      name="householdId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            🏠 Household
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a household" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {households.map((household) => (
                                <SelectItem
                                  key={household.id}
                                  value={household.id}
                                >
                                  <div className="flex flex-col">
                                    <span className="font-medium">
                                      {household.address}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                      Block {household.block}, Lot{" "}
                                      {household.lot}
                                    </span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Due Type */}
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Due Type
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select due type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="MONTHLY_DUES">
                                <span className="flex items-center gap-2">
                                  🏠 Monthly Dues
                                </span>
                              </SelectItem>
                              <SelectItem value="WATER_BILL">
                                <span className="flex items-center gap-2">
                                  💧 Water Bill
                                </span>
                              </SelectItem>
                              <SelectItem value="ELECTRICITY">
                                <span className="flex items-center gap-2">
                                  ⚡ Electricity
                                </span>
                              </SelectItem>
                              <SelectItem value="SPECIAL_ASSESSMENT">
                                <span className="flex items-center gap-2">
                                  📋 Special Assessment
                                </span>
                              </SelectItem>
                              <SelectItem value="ARREARAGES">
                                <span className="flex items-center gap-2">
                                  📊 Arrearages
                                </span>
                              </SelectItem>
                              <SelectItem value="PENALTY">
                                <span className="flex items-center gap-2">
                                  ⚠️ Penalty
                                </span>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Financial Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Wallet className="h-5 w-5" />
                    Financial Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Amount */}
                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount (₱)</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type="number"
                                step="0.01"
                                min="0.01"
                                className="pl-8"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                              />
                              <div className="absolute left-2 top-1/2 -mt-[3px] transform -translate-y-1/2 h-4 w-4 text-gray-400">₱</div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Late Fee */}
                    <FormField
                      control={form.control}
                      name="lateFee"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Late Fee (₱)</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type="number"
                                step="0.01"
                                min="0"
                                className="pl-8"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                              />
                              <Clock className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 mt-4 gap-6">
                    {/* Status */}
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="UNPAID">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                  Unpaid
                                </div>
                              </SelectItem>
                              <SelectItem value="PARTIAL">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                                  Partial Payment
                                </div>
                              </SelectItem>
                              <SelectItem value="PAID">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                  Paid
                                </div>
                              </SelectItem>
                              <SelectItem value="OVERDUE">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                                  Overdue
                                </div>
                              </SelectItem>
                              <SelectItem value="WAIVED">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                                  Waived
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Due Date */}
                    <FormField
                      control={form.control}
                      name="dueDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col mt-2.5">
                          <FormLabel>Due Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date < new Date("2000-01-01")
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Water Bill Specific Fields */}
              {selectedType === "WATER_BILL" && (
                <Card className="border-blue-200 bg-blue-50/50">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      💧 Water Bill Details
                    </CardTitle>
                    <CardDescription>
                      Enter meter readings to calculate water consumption
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="previousReading"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Previous Meter Reading</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  className="pl-8"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(
                                      parseFloat(e.target.value) || 0
                                    )
                                  }
                                />
                                <Calculator className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="meterReading"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Meter Reading</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  className="pl-8"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(
                                      parseFloat(e.target.value) || 0
                                    )
                                  }
                                />
                                <Calculator className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    {waterConsumption > 0 && (
                      <div className="mt-4 p-4 bg-blue-100 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Calculator className="h-4 w-4 text-blue-600" />
                          <span className="font-medium text-blue-800">
                            Water Consumption: {waterConsumption.toFixed(2)}{" "}
                            cubic meters
                          </span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Fiscal Period */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Fiscal Period</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Fiscal Month */}
                    <FormField
                      control={form.control}
                      name="fiscalMonth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fiscal Month</FormLabel>
                          <Select
                            onValueChange={(value) =>
                              field.onChange(parseInt(value))
                            }
                            value={field.value?.toString()}
                            disabled
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select month" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Array.from({ length: 12 }, (_, i) => i + 1).map(
                                (month) => (
                                  <SelectItem
                                    key={month}
                                    value={month.toString()}
                                  >
                                    {new Date(
                                      2000,
                                      month - 1,
                                      1
                                    ).toLocaleString("default", {
                                      month: "long",
                                    })}
                                  </SelectItem>
                                )
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Fiscal Year */}
                    <FormField
                      control={form.control}
                      name="fiscalYear"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fiscal Year</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="2000"
                              max="2100"
                              {...field}
                              onChange={(e) =>
                                field.onChange(
                                  parseInt(e.target.value) ||
                                    new Date().getFullYear()
                                )
                              }
                              disabled
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Additional Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Add any additional notes or details about this due..."
                            className="resize-none min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Form Actions */}
              <div className="flex justify-end gap-4">
                <Button type="submit" disabled={isLoading}>
                  {isLoading
                    ? "Saving..."
                    : initialData
                    ? "Update Due"
                    : "Create Due"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
