import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function Layout({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#111827] transition-colors duration-300">
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className="flex">
        <Sidebar isOpen={isOpen} />

        <div className="flex-1 min-h-screen md:ml-64">
          <Navbar toggleSidebar={() => setIsOpen(!isOpen)} />
          <main className="p-6 max-w-[1800px] mx-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}