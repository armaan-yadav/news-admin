import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import AppSidebar from "../components/AppSidebar";
import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import Header from "@/components/Header";

export default function MainLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <Outlet />
        <Toaster />
      </SidebarInset>
    </SidebarProvider>
  );
}
