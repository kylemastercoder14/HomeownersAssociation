"use client";

import * as React from "react";
import {
  Car,
  FileText,
  Hand,
  IdCard,
  Inbox,
  MapIcon,
  MessageCircleMore,
  PawPrint,
  ScrollText,
  SquareTerminal,
  SquareUserRound,
  TicketCheck,
  Truck,
  Users,
  Warehouse,
} from "lucide-react";

import { NavMain } from "@/components/globals/sidebar/nav-main";
import { NavProjects } from "@/components/globals/sidebar/nav-project";
import { NavUser } from "@/components/globals/sidebar/nav-user";
import { NavOthers } from "@/components/globals/sidebar/nav-others";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Admin } from "@prisma/client";

export function AppSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & { user: Admin | null }) {
  const pathname = usePathname();
  const data = {
    general: [
      {
        title: "Dashboard",
        url: "/admin/dashboard",
        icon: SquareTerminal,
        isActive: pathname === "/admin/dashboard",
      },
      {
        title: "Residents",
        url: "/admin/residents",
        icon: Users,
        isActive: pathname === "/admin/residents",
      },
      {
        title: "Mapping",
        url: "/admin/mapping",
        icon: MapIcon,
        isActive: pathname === "/admin/mapping",
      },
      {
        title: "Employees",
        url: "/admin/employees",
        icon: SquareUserRound,
        isActive: pathname === "/admin/employees",
      },
    ],
    services: [
      {
        name: "Blotter & Concerns",
        url: "/admin/blotter-concerns",
        icon: FileText,
        isActive: pathname === "/admin/blotter-concerns",
      },
      {
        name: "Ticketing",
        url: "/admin/ticketing",
        icon: TicketCheck,
        isActive: pathname === "/admin/ticketing",
      },
      {
        name: "Rentals",
        url: "/admin/rentals",
        icon: Warehouse,
        isActive: pathname === "/admin/rentals",
      },
      {
        name: "Vehicle Registration",
        url: "/admin/vehicle-registration",
        icon: Car,
        isActive: pathname === "/admin/vehicle-registration",
      },
      {
        name: "Pet Registration",
        url: "/admin/pet-registration",
        icon: PawPrint,
        isActive: pathname === "/admin/pet-registration",
      },
      {
        name: "Household Registration",
        url: "/admin/household-registration",
        icon: Hand,
        isActive: pathname === "/admin/household-registration",
      },
    ],
    others: [
      {
        name: "ID System",
        url: "/admin/id-system",
        icon: IdCard,
        isActive: pathname === "/admin/id-system",
      },
      {
        name: "Documents",
        url: "/admin/documents",
        icon: Inbox,
        isActive: pathname === "/admin/documents",
      },
      {
        name: "Permits",
        url: "/admin/permits",
        icon: Truck,
        isActive: pathname === "/admin/permits",
      },
      {
        name: "Logs",
        url: "/admin/logs",
        icon: ScrollText,
        isActive: pathname === "/admin/logs",
      },
      {
        name: "Feedbacks",
        url: "/admin/feedbacks",
        icon: MessageCircleMore,
        isActive: pathname === "/admin/feedbacks",
      },
    ],
  };
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Image
          className="mt-3 object-cover"
          alt="Logo"
          src="/assets/logo.png"
          width={200}
          height={200}
        />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.general} />
        <NavProjects projects={data.services} />
        <NavOthers projects={data.others} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
