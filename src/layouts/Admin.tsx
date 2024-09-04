// Packages
import { Outlet } from "react-router-dom";
import { ScrollShadow } from "@nextui-org/react";

// Components
import Navbar from "../components/Navbar";
import Sidebar, { items } from "../components/Sidebar";

const Admin = () => {
  return (
    <section className='flex min-h-screen'>
      <div className='h-dvh'>
        <div className='h-full w-72 border-r-small border-divider p-6'>
          <div className='flex items-center gap-2 px-2'>
            <span className='text-small font-bold uppercase'>
              LAIT Smart Documents
            </span>
          </div>
          <ScrollShadow className='h-full max-h-full py-[10vh]'>
            <Sidebar defaultSelectedKey='home' items={items} />
          </ScrollShadow>
        </div>
      </div>
      <div className='w-full'>
        <Navbar />
        <div className='p-10'>
          <Outlet />
        </div>
      </div>
    </section>
  );
};

export default Admin;
