import React from 'react';
import Image from "next/image";
import Link from "next/link";
import Img1 from "../../../../public/Container_31.png"
import Img2 from "../../../../public/Container_30.png"
import Img3 from "../../../../public/Container_42.png"
const Home = () => {
    return (
        <div
            style={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #e0f7fa 0%, #e8f5e9 50%, #f3e5f5 100%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "24px"
            }}
        >
            <h2 className="text-3xl font-extrabold text-gray-800">আপনার পাঠ্যবইসমূহ</h2>
            <div className='flex gap-6 items-center justify-center'>
                <Image src={Img1} alt='Bangla book' className='cursor-pointer hover:scale-105 transition-transform'></Image>
                <Link href="/math" className="hover:scale-105 transition-transform">
                    <Image src={Img2} alt='Math book' className='cursor-pointer'></Image>
                </Link>
                <Image src={Img3} alt='English book' className='cursor-pointer hover:scale-105 transition-transform'></Image>
            </div>
        </div>
    );
};

export default Home;