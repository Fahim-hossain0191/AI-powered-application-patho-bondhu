'use client'
import Image from "next/image";
// import Img1 from "../../../../public/Container_55.png"
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { auth } from "../services/api";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);

  // Check for logged in user
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      setUser(null);
    }
  }, [pathname]); // Re-run when route changes

  const handleLogout = async () => {
    try {
      await auth.logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    setUser(null);
    router.push("/signin");
  };

  const linkClass = (href) =>
  `text-black px-2 py-1 rounded ${
    pathname === href ? "bg-[#02C39A] text-white" : ""
  }`;
    return (
      <div className="navbar bg-[#BFDBFE] shadow-sm px-14">
  <div className="navbar-start">
    <div className="dropdown">
      <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
       
      </div>
      <ul
        tabIndex="-1"
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
        <li className="text-black"><a>Item 1</a></li>
        <li>
          <a>Parent</a>
          <ul className="p-2">
            <li ><a>Submenu 1</a></li>
            <li><a>Submenu 2</a></li>
          </ul>
        </li>
        <li><a>Item 3</a></li>
      </ul>
    </div>
    {/* <a className="btn btn-ghost text-xl">daisyUI</a> */}
   {/* <Image src={Img1} alt="Logo"  width={70} height={20} ></Image> */}
  </div>
  <div className="navbar-center hidden lg:flex">
    <ul className="menu menu-horizontal px-1 gap-2">
        <Link href="/home" className={linkClass("/home")}>
              পাঠ্যবই
            </Link>
        <Link href="/math" className={linkClass("/math")}>
              প্রাকটিস ও যাচাই
            </Link>
      <li className="text-black"><a>প্রগ্রেস</a></li>
      <li className="text-black"><a>অলিম্পিয়াড</a></li>
      <li>
        <details>
          <summary className="text-black">আরো</summary>
          <ul className="p-2 w-40 z-1 bg-[#BFDBFE]">
            {!user && (
              <>
                <li><Link href="/signup" className="text-black bg-[#BFDBFE]">রেজিস্ট্রেশন করুন</Link></li>
                <li><Link href="/signin" className="text-black bg-[#BFDBFE]">লগইন করুন</Link></li>
              </>
            )}
            {/* <li><a className="text-black bg-[#BFDBFE]">লগইন</a></li> */}
          </ul>
        </details>
      </li>
     
    </ul>
  </div>
  <div className="navbar-end">
    {user ? (
      <div className="dropdown dropdown-end">
        <div tabIndex={0} role="button" className="flex items-center gap-2 btn btn-ghost rounded-btn hover:bg-blue-200">
          <span className="font-semibold text-gray-800">{user.full_name}</span>
          <div className="avatar">
            <div className="w-10 rounded-full bg-blue-500 flex items-center justify-center">
              {user.profile_image_url ? (
                <img src={user.profile_image_url} alt="Profile" />
              ) : (
                <span className="text-white text-lg mt-1">{user.full_name.charAt(0).toUpperCase()}</span>
              )}
            </div>
          </div>
        </div>
        <ul tabIndex={0} className="menu dropdown-content z-[1] p-2 shadow bg-base-100 rounded-box w-52 mt-4">
          <li><a onClick={handleLogout} className="text-red-500 font-medium hover:bg-red-50">লগআউট (Logout)</a></li>
        </ul>
      </div>
    ) : (
      <Link href="/signin" className="btn bg-[#02C39A] text-white border-none hover:bg-[#02a07e]">
        লগইন
      </Link>
    )}
  </div>
</div>
   
    );
};

export default Navbar;