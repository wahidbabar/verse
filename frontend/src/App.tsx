import { FC, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import "./App.css";
import Footer from "./components/Footer";
import Loading from "./components/Loading";
import { AuthProvider } from "./context/AuthContext";
import { QueryProvider } from "./providers/query-client";
import { Toaster } from "sonner";
import Navbar from "./components/Navbar";

const App: FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loading />;
  }

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
