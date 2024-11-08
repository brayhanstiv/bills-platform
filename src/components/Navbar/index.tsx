// Packages
import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Avatar,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { cn } from "@nextui-org/react";
import { User } from "firebase/auth";

type AdminNavbarProps = {
  onToggle?: () => void;
  isCompact?: boolean;
};

const AdminNavbar = (props: AdminNavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const user: User = JSON.parse(sessionStorage.getItem("user")!);

  return (
    <Navbar
      {...props}
      classNames={{
        base: cn("border-default-100", {
          "bg-default-200/50 dark:bg-default-100/50": isMenuOpen,
        }),
        wrapper: "w-full justify-center",
        item: "hidden md:flex",
      }}
      height="60px"
      maxWidth="full"
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
    >
      {/* Left Content */}
      <NavbarBrand>
        <Icon
          className="text-gray-500 mr-2 cursor-pointer"
          icon={
            props.isCompact
              ? "hugeicons:sidebar-right-01"
              : "hugeicons:sidebar-left-01"
          }
          width={24}
          onClick={props.onToggle}
        />
        <p className="font-bold text-inherit">LAIT Smart Documents</p>
      </NavbarBrand>

      {/* Right Content */}
      <NavbarContent className="hidden md:flex" justify="end">
        <NavbarItem className="ml-2 !flex gap-2">
          <div
            className={cn(
              "flex items-center gap-3 px-4",
              props.isCompact && "justify-center"
            )}
          >
            <Avatar isBordered size="sm" src={user.photoURL!} />
          </div>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};

export default AdminNavbar;
