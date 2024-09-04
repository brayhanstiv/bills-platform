import { Outlet } from "react-router-dom";

const Auth = () => {
  return (
    <section className='flex justify-center items-center min-h-screen'>
      <Outlet />
    </section>
  );
};

export default Auth;
