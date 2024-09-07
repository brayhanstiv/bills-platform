// Packages
import React from "react";
import { Outlet } from "react-router-dom";
import { ScrollShadow } from "@nextui-org/react";
import { useMediaQuery } from "usehooks-ts";

// Components
import Navbar from "../components/Navbar";
import Sidebar, { items } from "../components/Sidebar";

// Common
import { cn } from "../common/cn";

const Admin = () => {
  // Hooks
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const isMobile = useMediaQuery("(max-width: 1024px)");

  const isCompact = isCollapsed || isMobile;

  const onToggle = React.useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  return (
    <section className='flex min-h-screen'>
      <div className='h-dvh'>
        <div
          className={cn(
            "bg-background flex h-full w-72 flex-col !border-r-small border-divider p-6 transition-width",
            {
              "w-16 items-center px-2 py-6": isCompact,
            }
          )}
        >
          <div className='flex items-center gap-2 px-2'>
            <span className='text-small font-bold uppercase'>
              {!isCompact ? "LAIT Smart Documents" : "LAIT"}
            </span>
          </div>
          <ScrollShadow className='h-full max-h-full py-[10vh]'>
            <Sidebar
              defaultSelectedKey='home'
              isCompact={isCompact}
              items={items}
            />
          </ScrollShadow>
        </div>
      </div>
      <section className='flex flex-col flex-grow overflow-auto'>
        <Navbar onToggle={onToggle} isCompact={isCompact} />
        <div className='w-full p-10'>
          <Outlet />
        </div>
      </section>
    </section>
  );
};

export default Admin;
