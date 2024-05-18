import { useSignOutAccount } from "@/lib/react-query/queriesAndMutations";
import { useEffect } from "react";
import { Outlet, Navigate, useNavigate } from "react-router-dom";

const AuthLayout: React.FC = () => {
  const isAuthenticated = false;

  const navigate = useNavigate();

  useEffect(() => {
    const checkLocalStorage = localStorage.getItem("cookieFallback")

    if (
        checkLocalStorage !== "[]"
    ) navigate("/")
  }, []);

  return (
    <>
      {isAuthenticated ? (
        <Navigate to = "/" />
      ) : (
        <>
          <img 
            src = "/assets/images/blue-background-cut.jpg"
            alt = "logo"
            className = "hidden xl:block h-screen w-1/5 object-cover bg-no-repeat rotate-180 fixed"
          /> 

          <section className = "flex flex-1 items-center flex-col py-10">
            <Outlet />
          </section>

          <img 
            src = "/assets/images/blue-background-cut.jpg"
            alt = "logo"
            className = "hidden xl:block h-screen w-1/5 object-cover bg-no-repeat fixed right-0 bottom-0"
          /> 
        </>
      )}
    </>
  )
}

export default AuthLayout