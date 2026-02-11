import ApiStatus from "./ApiStatus"

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white py-6 px-8 shadow-xl border-b border-slate-700">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Company Logo */}
            <div className="bg-white p-2 rounded-xl shadow-lg">
              <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                OKR
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
                OKR Management Platform
              </h1>
              <p className="text-slate-300 text-lg font-medium">
                Objectives, Key Results & SMART Goals
              </p>
              <div className="mt-3 flex items-center gap-2">
                <div className="w-2 h-2 bg-gradient-to-r from-teal-400 to-blue-500 rounded-full animate-pulse"></div>
                <ApiStatus />
              </div>
            </div>
          </div>
          {/* Decorative image overlay */}
          <div className="hidden md:block relative">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-blue-600/20 rounded-lg"></div>
            <img
              src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&h=120&fit=crop&crop=center"
              alt="Business workspace"
              className="w-48 h-28 object-cover rounded-lg shadow-lg border border-slate-600"
            />
            <div className="absolute bottom-2 right-2 text-xs text-white font-semibold bg-gradient-to-r from-teal-500 to-blue-600 px-2 py-1 rounded">
              Works Better.
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header


// import React from 'react';
// import ApiStatus from './ApiStatus';

// const Header = () => {
//   return (
//     <header className="bg-slate-900 text-white py-6 px-8 shadow-lg">
//       <div className="max-w-7xl mx-auto">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-6">
//             {/* Company Logo Space */}
//             <div className="bg-white p-3 rounded-lg shadow-md">
//               <div className="w-12 h-12 bg-slate-200 rounded flex items-center justify-center text-slate-600 font-bold text-lg">
//                 OKR
//               </div>
//             </div>
//             <div>
//               <h1 className="text-3xl font-bold text-white mb-2">
//                 OKR Management Platform
//               </h1>              <p className="text-blue-200 text-lg">
//                 Objectives, Key Results & SMART Goals
//               </p>
//               <div className="mt-2">
//                 <ApiStatus apiUrl={import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'} />

//               </div>
//             </div>
//           </div>
//           {/* Random decorative image */}
//           <div className="hidden md:block">
//             <img 
//               src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&h=120&fit=crop&crop=center" 
//               alt="Business workspace" 
//               className="w-48 h-28 object-cover rounded-lg shadow-lg opacity-80"
//             />
//           </div>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;
