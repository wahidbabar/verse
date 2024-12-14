import { FC } from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import "./App.css";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import { QueryProvider } from "./providers/query-client";

const App: FC = () => {
  return (
    <>
      <AuthProvider>
        <QueryProvider>
          <Toaster />
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow px-4 pt-4 sm:px-10">
              <Outlet />
            </main>
            <Footer />
          </div>
        </QueryProvider>
      </AuthProvider>
    </>
  );
};

export default App;
