// Packages
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
} from "@nextui-org/react";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

// Firebase
import { auth } from "../../firebase_config";
import { Icon } from "@iconify/react";

type NavbarProps = {
  onToggle?: () => void;
  isCompact?: boolean;
};

const AdminNavbar = (props: NavbarProps) => {
  const navigate = useNavigate();

  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <Navbar shouldHideOnScroll maxWidth='full'>
      <NavbarBrand>
        <Icon
          className='text-gray-500 mr-2 cursor-pointer'
          icon={
            props.isCompact
              ? "hugeicons:sidebar-right-01"
              : "hugeicons:sidebar-left-01"
          }
          width={24}
          onClick={props.onToggle}
        />
        <p className='font-bold text-inherit'>LAIT Smart Documents</p>
      </NavbarBrand>
      <NavbarContent justify='end'>
        <NavbarItem>
          <Button
            as={Link}
            color='primary'
            href='#'
            variant='flat'
            onPress={logout}
          >
            Cerrar Sesión
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};

export default AdminNavbar;
