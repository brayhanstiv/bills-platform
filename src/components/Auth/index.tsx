import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

type RequireAuthProps = {
  children: ReactNode;
};

const RequireAuth = (props: RequireAuthProps) => {
  let user: string | null = localStorage.getItem("user");

  if (!user) {
    return <Navigate to='/' />;
  }

  return props.children;
};

export default RequireAuth;
