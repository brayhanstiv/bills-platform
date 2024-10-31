// Packages
import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Avatar, Button, ScrollShadow, Spacer } from "@nextui-org/react";
import { useMediaQuery } from "usehooks-ts";

// Components
import Navbar from "../components/Navbar";
import InvoiceSidebar from "../components/Sidebar/invoice";

// Common
import { Icon } from "@iconify/react/dist/iconify.js";
import { invoiceItems } from "../common/constants";
import Logo from "../common/assets/img/lait.png";
import { cn } from "../common/cn";

// Firebase
import { signOut } from "firebase/auth";
import { auth } from "../firebase_config";

const Invoice = () => {
  // Hooks
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const isMobile = useMediaQuery("(max-width: 1024px)");
  const navigate = useNavigate();

  const isCompact = isCollapsed || isMobile;

  const onToggle = React.useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <section className='flex min-h-screen'>
      <div className='h-dvh'>
        <div
          className={cn(
            "relative flex h-full flex-1 flex-col border-r-small border-divider p-6",
            !isCompact && "w-72"
          )}
        >
          <div className='flex justify-center items-center gap-2 px-2'>
            <div className='flex h-8 w-8 items-center justify-center'>
              <img className='w-24' src={Logo} />
            </div>
            {!isCompact && (
              <span className='text-small font-bold'>LAIT Smart Documents</span>
            )}
          </div>
          <Spacer y={12} />
          <div
            className={cn(
              "flex items-center gap-3 px-4",
              isCompact && "justify-center"
            )}
          >
            <Avatar
              isBordered
              size='sm'
              src='https://i.pravatar.cc/150?u=a04258114e29026708c'
            />
            {!isCompact && (
              <div className='flex flex-col'>
                <p className='text-small font-medium text-default-600'>
                  John Doe
                </p>
                <p className='text-tiny text-default-400'>Product Designer</p>
              </div>
            )}
          </div>
          <ScrollShadow className='-mr-6 h-full max-h-full py-6 pr-6'>
            <InvoiceSidebar
              defaultSelectedKey='home'
              items={invoiceItems}
              isCompact={isCompact}
            />
          </ScrollShadow>
          <div className='mt-auto flex flex-col'>
            <Button
              className={cn(
                "text-default-500 data-[hover=true]:text-foreground",
                isCompact ? "justify-center" : "justify-start"
              )}
              onClick={logout}
              startContent={
                <Icon
                  className='rotate-180 text-default-500'
                  icon='solar:minus-circle-line-duotone'
                  width={24}
                />
              }
              variant='light'
            >
              {!isCompact && "Cerrar Sesión"}
            </Button>
          </div>
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

export default Invoice;
