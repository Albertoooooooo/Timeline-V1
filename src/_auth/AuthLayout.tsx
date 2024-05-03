import { Outlet, Navigate } from "react-router-dom";

const AuthLayout = () => {
  const isAuthenticated = false;
  return (
    <>
      {isAuthenticated ? (
        <Navigate to = "/" />
      ) : (
        <>
          <img 
            src = "/assets/images/blue-background-cut.jpg"
            alt = "logo"
            className = "hidden xl:block h-screen w-1/5 object-cover bg-no-repeat rotate-180"
          /> 

          <section className = "flex flex-1 justify-center items-center flex-col py-10">
            <Outlet />
          </section>

          <img 
            src = "/assets/images/blue-background-cut.jpg"
            alt = "logo"
            className = "hidden xl:block h-screen w-1/5 object-cover bg-no-repeat"
          /> 
        </>
      )}
    </>
  )
}

export default AuthLayout