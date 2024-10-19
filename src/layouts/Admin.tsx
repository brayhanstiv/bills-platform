// Packages
import { Outlet } from "react-router-dom";

const Admin = () => {
  return (
    <section className='min-w-screen min-h-screen gap-4'>
      <Outlet />
    </section>
  );
};

export default Admin;
