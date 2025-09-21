import "preline/preline";
import '@/assets/scss/style.scss'


import AppProviders from "./components/wrappers/AppProviders"
import AppRouter from "./routes/router"
import { useEffect } from 'react';
import {  useLocation } from 'react-router-dom';


import { IStaticMethods } from "preline/preline";

declare global {
  interface Window {
    HSStaticMethods: IStaticMethods;
  }
}

function App() {
  const location = useLocation();

  useEffect(() => {

    setTimeout(() => {
      window.HSStaticMethods.autoInit();
      console.log(window.HSStaticMethods)
    },100)
  }, [location.pathname]);

  return (
    <>
      <AppProviders>
          <AppRouter/>
      </AppProviders>
    </>
  )
}

export default App
