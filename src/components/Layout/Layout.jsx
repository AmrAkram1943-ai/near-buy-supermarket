// import React from 'react'
// import { Outlet } from 'react-router-dom'
// import Navbar from '../Navbar/navbar'

// export default function Layout() {
//   return <>
//   <Navbar></Navbar>
//   <Outlet></Outlet>
//   </>
// }

// layouts/MainLayout.jsx
   

// import Sidebar from "../Sidebar/Sidebar";

// export default function Layout({ children }) {
//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       <Sidebar />
//       <div className="flex-1 p-6">
//         {children}
//       </div>
//     </div>
//   );
// }


import Sidebar from "../Sidebar/Sidebar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100 lg:flex">
      <Sidebar />

      <div className="flex-1 p-4 sm:p-6">
        {children}
      </div>
    </div>
  );
}