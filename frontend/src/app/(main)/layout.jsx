import Navbar from "@/components/Navbar";



const MainLayout = ({children}) => {
    return (
        <div>
              
        
      <Navbar></Navbar>
        {
            children
        }
        </div>
    );
};

export default MainLayout;