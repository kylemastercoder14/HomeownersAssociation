import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function SectionCards() {
  return (
    <div className="grid lg:grid-cols-4 grid-cols-1 gap-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Collected Dues</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            ₱24,850.00
          </CardTitle>
          <CardFooter>
            <Badge variant="outline">
              <IconTrendingUp />
              +8.2%
            </Badge>
          </CardFooter>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            On-time payments increasing <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Current fiscal year collections
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Outstanding Dues</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            ₱3,420.00
          </CardTitle>
          <CardFooter>
            <Badge variant="outline">
              <IconTrendingDown />
              -15%
            </Badge>
          </CardFooter>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Delinquencies decreasing <IconTrendingDown className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Compared to last quarter
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Active Residents</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            148
          </CardTitle>
          <CardFooter>
            <Badge variant="outline">
              <IconTrendingUp />
              +5.7%
            </Badge>
          </CardFooter>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Community growing steadily <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">12 new homes occupied</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Open Work Orders</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            14
          </CardTitle>
          <CardFooter>
            <Badge variant="outline">
              <IconTrendingDown />
              -22%
            </Badge>
          </CardFooter>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Maintenance efficiency improving <IconTrendingDown className="size-4" />
          </div>
          <div className="text-muted-foreground">Average resolution: 3.2 days</div>
        </CardFooter>
      </Card>
    </div>
  )
}
