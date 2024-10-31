import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const Views = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <Navbar/>
        <div className={`max-w-7xl w-full mx-auto`}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Views;
