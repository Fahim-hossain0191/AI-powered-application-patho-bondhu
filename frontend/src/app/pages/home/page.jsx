import React from 'react';
import Image from "next/image";
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
                justifyContent: "center"
            }}
        >
            <h2>Home page</h2>
            <div className='flex '>
                <Image src={Img1} alt='Bangla bbok' className='cursor-pointer'></Image>
                <Image src={Img2} alt='Math book' className='cursor-pointer'></Image>
                <Image src={Img3} alt='English bbok' className='cursor-pointer'></Image>
            </div>
        </div>
    );
};

export default Home;