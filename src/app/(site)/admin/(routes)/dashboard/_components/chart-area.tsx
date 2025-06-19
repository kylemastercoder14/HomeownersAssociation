"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardFooter,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

export const description = "HOA financial and maintenance tracking chart"

const hoaChartData = [
  { date: "2024-04-01", duesCollected: 4220, maintenanceRequests: 8 },
  { date: "2024-04-02", duesCollected: 0, maintenanceRequests: 3 },
  { date: "2024-04-03", duesCollected: 1850, maintenanceRequests: 5 },
  { date: "2024-04-04", duesCollected: 3240, maintenanceRequests: 7 },
  { date: "2024-04-05", duesCollected: 2730, maintenanceRequests: 4 },
  { date: "2024-04-06", duesCollected: 0, maintenanceRequests: 2 },
  { date: "2024-04-07", duesCollected: 0, maintenanceRequests: 1 },
  { date: "2024-04-08", duesCollected: 4090, maintenanceRequests: 6 },
  { date: "2024-04-09", duesCollected: 1590, maintenanceRequests: 4 },
  { date: "2024-04-10", duesCollected: 2610, maintenanceRequests: 5 },
  { date: "2024-04-11", duesCollected: 3270, maintenanceRequests: 9 },
  { date: "2024-04-12", duesCollected: 2920, maintenanceRequests: 7 },
  { date: "2024-04-13", duesCollected: 0, maintenanceRequests: 3 },
  { date: "2024-04-14", duesCollected: 0, maintenanceRequests: 2 },
  { date: "2024-04-15", duesCollected: 1200, maintenanceRequests: 4 },
  { date: "2024-04-16", duesCollected: 1380, maintenanceRequests: 5 },
  { date: "2024-04-17", duesCollected: 4460, maintenanceRequests: 8 },
  { date: "2024-04-18", duesCollected: 3640, maintenanceRequests: 6 },
  { date: "2024-04-19", duesCollected: 2430, maintenanceRequests: 4 },
  { date: "2024-04-20", duesCollected: 0, maintenanceRequests: 1 },
  { date: "2024-04-21", duesCollected: 0, maintenanceRequests: 0 },
  { date: "2024-04-22", duesCollected: 2240, maintenanceRequests: 3 },
  { date: "2024-04-23", duesCollected: 1380, maintenanceRequests: 5 },
  { date: "2024-04-24", duesCollected: 3870, maintenanceRequests: 7 },
  { date: "2024-04-25", duesCollected: 2150, maintenanceRequests: 4 },
  { date: "2024-04-26", duesCollected: 750, maintenanceRequests: 3 },
  { date: "2024-04-27", duesCollected: 0, maintenanceRequests: 2 },
  { date: "2024-04-28", duesCollected: 0, maintenanceRequests: 1 },
  { date: "2024-04-29", duesCollected: 3150, maintenanceRequests: 6 },
  { date: "2024-04-30", duesCollected: 4540, maintenanceRequests: 9 },
  { date: "2024-05-01", duesCollected: 1650, maintenanceRequests: 5 },
  { date: "2024-05-02", duesCollected: 2930, maintenanceRequests: 7 },
  { date: "2024-05-03", duesCollected: 2470, maintenanceRequests: 4 },
  { date: "2024-05-04", duesCollected: 0, maintenanceRequests: 2 },
  { date: "2024-05-05", duesCollected: 0, maintenanceRequests: 1 },
  { date: "2024-05-06", duesCollected: 4980, maintenanceRequests: 8 },
  { date: "2024-05-07", duesCollected: 3880, maintenanceRequests: 6 },
  { date: "2024-05-08", duesCollected: 1490, maintenanceRequests: 4 },
  { date: "2024-05-09", duesCollected: 2270, maintenanceRequests: 5 },
  { date: "2024-05-10", duesCollected: 2930, maintenanceRequests: 7 },
  { date: "2024-05-11", duesCollected: 0, maintenanceRequests: 3 },
  { date: "2024-05-12", duesCollected: 0, maintenanceRequests: 2 },
  { date: "2024-05-13", duesCollected: 1970, maintenanceRequests: 4 },
  { date: "2024-05-14", duesCollected: 4480, maintenanceRequests: 9 },
  { date: "2024-05-15", duesCollected: 4730, maintenanceRequests: 7 },
  { date: "2024-05-16", duesCollected: 3380, maintenanceRequests: 5 },
  { date: "2024-05-17", duesCollected: 4990, maintenanceRequests: 8 },
  { date: "2024-05-18", duesCollected: 0, maintenanceRequests: 3 },
  { date: "2024-05-19", duesCollected: 0, maintenanceRequests: 1 },
  { date: "2024-05-20", duesCollected: 1770, maintenanceRequests: 4 },
  { date: "2024-05-21", duesCollected: 820, maintenanceRequests: 3 },
  { date: "2024-05-22", duesCollected: 810, maintenanceRequests: 2 },
  { date: "2024-05-23", duesCollected: 2520, maintenanceRequests: 6 },
  { date: "2024-05-24", duesCollected: 2940, maintenanceRequests: 7 },
  { date: "2024-05-25", duesCollected: 0, maintenanceRequests: 3 },
  { date: "2024-05-26", duesCollected: 0, maintenanceRequests: 1 },
  { date: "2024-05-27", duesCollected: 4200, maintenanceRequests: 8 },
  { date: "2024-05-28", duesCollected: 2330, maintenanceRequests: 5 },
  { date: "2024-05-29", duesCollected: 780, maintenanceRequests: 3 },
  { date: "2024-05-30", duesCollected: 3400, maintenanceRequests: 7 },
  { date: "2024-05-31", duesCollected: 1780, maintenanceRequests: 4 },
  { date: "2024-06-01", duesCollected: 0, maintenanceRequests: 2 },
  { date: "2024-06-02", duesCollected: 0, maintenanceRequests: 1 },
  { date: "2024-06-03", duesCollected: 1030, maintenanceRequests: 4 },
  { date: "2024-06-04", duesCollected: 4390, maintenanceRequests: 9 },
  { date: "2024-06-05", duesCollected: 880, maintenanceRequests: 3 },
  { date: "2024-06-06", duesCollected: 2940, maintenanceRequests: 7 },
  { date: "2024-06-07", duesCollected: 3230, maintenanceRequests: 8 },
  { date: "2024-06-08", duesCollected: 0, maintenanceRequests: 3 },
  { date: "2024-06-09", duesCollected: 0, maintenanceRequests: 1 },
  { date: "2024-06-10", duesCollected: 1550, maintenanceRequests: 5 },
  { date: "2024-06-11", duesCollected: 920, maintenanceRequests: 3 },
  { date: "2024-06-12", duesCollected: 4920, maintenanceRequests: 10 },
  { date: "2024-06-13", duesCollected: 810, maintenanceRequests: 4 },
  { date: "2024-06-14", duesCollected: 4260, maintenanceRequests: 8 },
  { date: "2024-06-15", duesCollected: 3070, maintenanceRequests: 6 },
  { date: "2024-06-16", duesCollected: 0, maintenanceRequests: 2 },
  { date: "2024-06-17", duesCollected: 4750, maintenanceRequests: 9 },
  { date: "2024-06-18", duesCollected: 1070, maintenanceRequests: 4 },
  { date: "2024-06-19", duesCollected: 3410, maintenanceRequests: 7 },
  { date: "2024-06-20", duesCollected: 4080, maintenanceRequests: 8 },
  { date: "2024-06-21", duesCollected: 1690, maintenanceRequests: 5 },
  { date: "2024-06-22", duesCollected: 3170, maintenanceRequests: 6 },
  { date: "2024-06-23", duesCollected: 0, maintenanceRequests: 2 },
  { date: "2024-06-24", duesCollected: 1320, maintenanceRequests: 4 },
  { date: "2024-06-25", duesCollected: 1410, maintenanceRequests: 5 },
  { date: "2024-06-26", duesCollected: 4340, maintenanceRequests: 9 },
  { date: "2024-06-27", duesCollected: 4480, maintenanceRequests: 8 },
  { date: "2024-06-28", duesCollected: 1490, maintenanceRequests: 5 },
  { date: "2024-06-29", duesCollected: 0, maintenanceRequests: 1 },
  { date: "2024-06-30", duesCollected: 4460, maintenanceRequests: 7 },
]

const hoaChartConfig = {
  duesCollected: {
    label: "Dues Collected ($)",
    color: "var(--primary)",
  },
  maintenanceRequests: {
    label: "Maintenance Requests",
    color: "var(--secondary)",
  },
} satisfies ChartConfig

export function HOAChartAreaInteractive() {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("90d")
  const [activeMetric, setActiveMetric] = React.useState<"dues" | "maintenance">("dues")

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  const filteredData = hoaChartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date("2024-06-30")
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  return (
    <Card className="@container/card">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>
              {activeMetric === "dues" ? "Dues Collection" : "Maintenance Requests"}
            </CardTitle>
            <CardDescription>
              {activeMetric === "dues"
                ? "Monthly dues payment tracking"
                : "Open maintenance requests"}
            </CardDescription>
          </div>
          <ToggleGroup
            type="single"
            value={activeMetric}
            onValueChange={(value) => setActiveMetric(value as "dues" | "maintenance")}
            variant="outline"
            className="h-10"
          >
            <ToggleGroupItem value="dues">Dues</ToggleGroupItem>
            <ToggleGroupItem value="maintenance">Maintenance</ToggleGroupItem>
          </ToggleGroup>
        </div>
        <CardFooter className="pt-4 pb-0 px-0">
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              aria-label="Select time range"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardFooter>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={hoaChartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillDues" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-duesCollected)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-duesCollected)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillMaintenance" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-maintenanceRequests)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-maintenanceRequests)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              defaultIndex={isMobile ? -1 : 10}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            {activeMetric === "dues" ? (
              <Area
                dataKey="duesCollected"
                type="natural"
                fill="url(#fillDues)"
                stroke="var(--color-duesCollected)"
                activeDot={{ r: 6 }}
              />
            ) : (
              <Area
                dataKey="maintenanceRequests"
                type="natural"
                fill="url(#fillMaintenance)"
                stroke="var(--color-maintenanceRequests)"
                activeDot={{ r: 6 }}
              />
            )}
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
