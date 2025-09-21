import logo from "@/assets/images/logo.png";
import IconifyIcon from "@/components/wrappers/IconifyIcon";
import useScrollEvent from "@/hooks/useScrollEvent";
import Gumshoe from 'gumshoejs'
import { useEffect, useRef, useState } from "react";

const Navigation = () => {
  const navRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (navRef.current) new Gumshoe('.navbar-nav a',{offset:80})
  }, []);

  const { scrollY } = useScrollEvent()
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <nav
        ref={navRef}
        className={`navbar ${scrollY>=50 && ' is-sticky'} fixed top-0 start-0 end-0 z-999 transition-all duration-500 py-5 items-center shadow-md lg:shadow-none [&.is-sticky]:bg-white group [&.is-sticky]:shadow-md bg-white lg:bg-transparent`}
        id="navbar"
      >
        <div className="container">
          <div className="flex lg:flex-nowrap flex-wrap items-center">
           <a href="index-1.html" className="flex items-center">
              <img
                src={logo}
                className="h-9 flex"
                alt="logo"
                width={118}
                height={36}
              />
            </a>
            <div className="lg:hidden flex items-center ms-auto px-2.5">
              <button onClick={toggleMenu}
                className="hs-collapse-toggle"
                type="button"
                id="hs-unstyled-collapse"
                data-hs-collapse="#navbarCollapse"
              >
                <IconifyIcon
                  icon="lucide:menu"
                  className="h-8 w-8 text-black"
                />
              </button>
            </div>
            <div
              className="navigation hs-collapse transition-all duration-300 lg:basis-auto basis-full grow hidden items-center justify-center lg:flex mx-auto overflow-hidden mt-6 lg:mt-0 nav-light"
              id="navbarCollapse"
            >
              <ul
                className="navbar-nav flex-col lg:flex-row gap-y-2 flex lg:items-center justify-center"
                id="navbar-navlist"
              >
                <li className="nav-item mx-1.5 transition-all text-dark lg:text-black group-[&.is-sticky]:text-dark all duration-300 hover:text-primary [&.active]:!text-primary group-[&.is-sticky]:[&.active]:text-primary">
                  <a 
                    className="nav-link inline-flex items-center text-sm lg:text-base font-medium py-0.5 px-2 capitalize"
                    href="#home"
                  >
                    Home
                  </a>
                </li>
                <li className="nav-item mx-1.5 transition-all text-dark lg:text-black group-[&.is-sticky]:text-dark duration-300 hover:text-primary [&.active]:!text-primary group-[&.is-sticky]:[&.active]:text-primary">
                  <a 
                    className="nav-link inline-flex items-center text-sm lg:text-base font-medium py-0.5 px-2 capitalize"
                    href="#services"
                  >
                    Services
                  </a>
                </li>
                <li className="nav-item mx-1.5 transition-all text-dark lg:text-black group-[&.is-sticky]:text-dark duration-300 hover:text-primary [&.active]:!text-primary group-[&.is-sticky]:[&.active]:text-primary">
                  <a 
                    className="nav-link inline-flex items-center text-sm lg:text-base font-medium py-0.5 px-2 capitalize"
                    href="#features"
                  >
                    Features
                  </a>
                </li>
                <li className="nav-item mx-1.5 transition-all text-dark lg:text-black group-[&.is-sticky]:text-dark duration-300 hover:text-primary [&.active]:!text-primary group-[&.is-sticky]:[&.active]:text-primary">
                  <a 
                    className="nav-link inline-flex items-center text-sm lg:text-base font-medium py-0.5 px-2 capitalize"
                    href="#about"
                  >
                    About
                  </a>
                </li>
                <li className="nav-item mx-1.5 transition-all text-dark lg:text-black group-[&.is-sticky]:text-dark duration-300 hover:text-primary [&.active]:!text-primary group-[&.is-sticky]:[&.active]:text-primary">
                  <a 
                    className="nav-link inline-flex items-center text-sm lg:text-base font-medium py-0.5 px-2 capitalize"
                    href="#pricing"
                  >
                    Pricing
                  </a>
                </li>
                <li className="nav-item mx-1.5 transition-all text-dark lg:text-black group-[&.is-sticky]:text-dark duration-300 hover:text-primary [&.active]:!text-primary group-[&.is-sticky]:[&.active]:text-primary">
                  <a 
                    className="nav-link inline-flex items-center text-sm lg:text-base font-medium py-0.5 px-2 capitalize"
                    href="#testimonial"
                  >
                    Testimonials
                  </a>
                </li>
                <li className="nav-item mx-1.5 transition-all text-dark lg:text-black group-[&.is-sticky]:text-dark duration-300 hover:text-primary [&.active]:!text-primary group-[&.is-sticky]:[&.active]:text-primary">
                  <a 
                    className="nav-link inline-flex items-center text-sm lg:text-base font-medium py-0.5 px-2 capitalize"
                    href="#blog"
                  >
                    Blog
                  </a>
                </li>
                <li className="nav-item mx-1.5 transition-all text-dark lg:text-black group-[&.is-sticky]:text-dark duration-300 hover:text-primary [&.active]:!text-primary group-[&.is-sticky]:[&.active]:text-primary">
                  <a 
                    className="nav-link inline-flex items-center text-sm lg:text-base font-medium py-0.5 px-2 capitalize"
                    href="#contact"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div className="ms-auto shrink hidden lg:inline-flex gap-2">
              <a 
                href="#"
                className="py-2 px-6 inline-flex items-center gap-2 rounded-md text-base text-white bg-primary hover:bg-primaryDark transition-all duration-500 font-medium"
              >
                <IconifyIcon
                  icon="lucide:download-cloud"
                  className="h-4 w-4 fill-white/40"
                />
                <span className="hidden sm:block">Download</span>
              </a>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navigation;
