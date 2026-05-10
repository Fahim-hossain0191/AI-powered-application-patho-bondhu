'use client'
import Image from "next/image";
import Img1 from "../../../../public/Container_55.png"
import Link from "next/link";
import { usePathname } from "next/navigation";
const Navbar = () => {
  const pathname = usePathname();
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
   <Image src={Img1} alt="Logo"  width={70} height={20} ></Image>
  </div>
  <div className="navbar-center hidden lg:flex">
    <ul className="menu menu-horizontal px-1">
        <Link href="/pages/home" className={linkClass("/pages/home")}>
              পাঠ্যবই
            </Link>
      <li className="text-black"><a>প্রাকটিস</a></li>
      <li className="text-black"><a>প্রগ্রেস</a></li>
      <li className="text-black"><a>অলিম্পিয়াড</a></li>
      <li>
        <details>
          <summary className="text-black">আরো</summary>
          <ul className="p-2 w-40 z-1 bg-[#BFDBFE]">
            <li><Link href="/pages/signin" className="text-black bg-[#BFDBFE]">সাইন ইন</Link></li>
             <li><Link href="/pages/login" className="text-black bg-[#BFDBFE]">লগইন</Link></li>
            {/* <li><a className="text-black bg-[#BFDBFE]">লগইন</a></li> */}
          </ul>
        </details>
      </li>
     
    </ul>
  </div>
  <div className="navbar-end">
    <a className="btn">Button</a>
  </div>
</div>
   
    );
};

export default Navbar;