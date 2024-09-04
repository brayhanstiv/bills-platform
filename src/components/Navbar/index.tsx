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

export default function App() {
  const navigate = useNavigate();

  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <Navbar shouldHideOnScroll maxWidth='full'>
      <NavbarBrand>
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
}
