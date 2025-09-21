import Footer from "./components/Footer";
import Topnavbar from "./components/Topnavbar";
import Demos from "./components/Demos";
import frametailwind from '@/assets/images/frame/tailwind.png'
import framehtml from '@/assets/images/frame/html.svg'
import framecss from '@/assets/images/frame/css.svg'
import framejavascript from '@/assets/images/frame/javascript.svg'
import framescss2 from '@/assets/images/frame/scss2.png'
import frameyarn from '@/assets/images/frame/yarn.png'


const page = () => {
  return (
    <>
      <div>
        <Topnavbar/>
        <section
          className="relative pt-32 pb-32 overflow-x-hidden bg-[url(../images/bg-demo.jpg)] bg-no-repeat bg-cover"
          id="home"
        >
          <div className="container">
            <div className="grid grid-cols-1 gap-6 items-center justify-center">
              <div className="text-sm py-20 px-10 text-center max-w-xl mx-auto">
                <h1 className="text-4xl text-dark tracking-normal leading-normal font-bold mb-4 mt-6">
                  Evea - <span className="text-primary">App Landing</span>{" "}
                  Template With Tailwind
                </h1>
                <h4 className="text-xl text-dark tracking-normal leading-normal font-bold mb-4 mt-4">
                  <span className="text-primary">6</span> Homepages{" "}
                </h4>
              </div>
            </div>
            <div className="text-center mt-16">
              <div className="inline-flex flex-wrap items-center justify-center gap-4">
                <div className="w-16 h-16 flex justify-center items-center rounded-md bg-white">
                  <img
                    src={frametailwind}
                    className="w-9 h-9" alt="img"
                  />
                </div>
                <div className="w-16 h-16 flex justify-center items-center rounded-md bg-white">
                  <img src={framehtml} className="w-9 h-9" alt="html" />
                </div>
                <div className="w-16 h-16 flex justify-center items-center rounded-md bg-white">
                  <img src={framecss} className="w-9 h-9" alt="css"/>
                </div>
                <div className="w-16 h-16 flex justify-center items-center rounded-md bg-white">
                  <img
                    src={framejavascript}
                    className="w-9 h-9" alt="js"
                  />
                </div>
                <div className="w-16 h-16 flex justify-center items-center rounded-md bg-white">
                  <img
                    src={framescss2}
                    className="w-9 h-9" alt="scss"
                  />
                </div>
                <div className="w-16 h-16 flex justify-center items-center rounded-md bg-white">
                  <img src={frameyarn} className="w-9 h-9" alt="yarn" />
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className="relative">
          <div className="shape absolute sm:-bottom-px -bottom-[2px] start-0 end-0 overflow-hidden z-1 text-white">
            <svg
              className="w-full h-auto scale-[2.0] origin-top"
              viewBox="0 0 2880 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 48H1437.5H2880V0H2160C1442.5 52 720 0 720 0H0V48Z"
                fill="currentColor"
              />
            </svg>
          </div>
        </div>
            <Demos/>
        <Footer/>
      </div>
    </>
  );
};

export default page;
  

