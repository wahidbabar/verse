import { FC, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import "./App.css";
import Footer from "./components/Footer";
import Loading from "./components/Loading";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";

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
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow px-10">
            <Outlet />
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </>
  );
};

export default App;
