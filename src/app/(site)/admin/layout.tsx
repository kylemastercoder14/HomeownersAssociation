/* eslint-disable react-hooks/rules-of-hooks */
import React from "react";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import { AppSidebar } from "@/components/globals/sidebar/app-sidebar";
import Header from "@/components/globals/header";
import { useUser } from "@/hooks/use-user";
import { redirect } from "next/navigation";

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  const { user } = await useUser();
  if (!user) {
    return redirect("/");
  }
  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset>
        <Header />
        <main className="p-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminLayout;
