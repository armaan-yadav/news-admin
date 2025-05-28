import React, { useContext } from "react";
import { SidebarTrigger } from "./ui/sidebar";
import storeContext from "@/context/storeContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Header = () => {
  const { store } = useContext(storeContext);
  const userName = store?.userInfo?.name || "User";

  return (
    <header className="flex h-16 items-center justify-between border-b px-4 bg-white shadow-sm">
      <div className="flex items-center gap-4 justify-between w-full">
        <SidebarTrigger className="-ml-1" />
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={store?.userInfo?.avatar} alt={userName} />
            <AvatarFallback>{userName[0]}</AvatarFallback>
          </Avatar>
          <span className="font-semibold">{userName}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
