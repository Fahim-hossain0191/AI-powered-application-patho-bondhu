'use client'

import React from 'react';
import Image from "next/image";
import Link from 'next/link';
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
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                fontFamily: "'Hind Siliguri', sans-serif"
            }}
        >
            <h2 style={{ fontSize: "28px", fontWeight: "700", color: "#1e293b", marginBottom: "20px" }}>আজকে তুমি কী শিখতে চাও?</h2>
            <div className='flex gap-6'>
                <Image src={Img1} alt='Bangla book' className='cursor-pointer'></Image>
                <Link href="/pages/math">
                    <Image src={Img2} alt='Math book' className='cursor-pointer' style={{ transition: 'transform 0.2s' }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}></Image>
                </Link>
                <Image src={Img3} alt='English book' className='cursor-pointer'></Image>
            </div>
        </div>
    );
};

export default Home;