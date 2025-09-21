
import { Link } from "react-router-dom";
import { pricingData } from "../data";

const Demos = () => {
  return (
    <>
      <section className="section py-20" id="demo">
        <div className="container">
          <div className="mx-10">
            <div className="text-2xl text-center font-semibold mb-10 text-primary">
              {" "}
              Template Demo
            </div>
            <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-10 justify-center items-center">
              {pricingData.map((item, idx) => {
                return (
                  <Link key={idx} className="group" to={item.path} target="_blank">
                    <div className="rounded-xl overflow-hidden border border-gray-200">
                      <img
                        src={item.image}
                        className="rounded transition-all duration-500 shadow group-hover:shadow-sm group-hover:scale-110"
                        alt="work-image"
                      />
                    </div>
                    <h4 className="text-lg text-center mt-4">{item.name}</h4>
                  </Link>
                );
              })}
              {/*<Link className="group" href="index-2.html" target="_blank">
                <div className="rounded-xl overflow-hidden border border-gray-200">
                  <Image
                    src={demobg2}
                    className="rounded transition-all duration-500 shadow group-hover:shadow-sm group-hover:scale-110"
                    alt="work-image"
                  />
                </div>
                <h4 className="text-lg text-center mt-5">Layout - 2</h4>
              </a>
             <Link className="group" href="index-3.html" target="_blank">
                <div className="rounded-xl overflow-hidden border border-gray-200">
                  <Image
                    src={demobg3}
                    className="rounded transition-all duration-500 shadow group-hover:shadow-sm group-hover:scale-110"
                    alt="work-image"
                  />
                </div>
                <h4 className="text-lg text-center mt-5">Layout - 3</h4>
              </a>
             <Link className="group" href="index-4.html" target="_blank">
                <div className="rounded-xl overflow-hidden border border-gray-200">
                  <Image
                    src={demobg4}
                    className="rounded transition-all duration-500 shadow group-hover:shadow-sm group-hover:scale-110"
                    alt="work-image"
                  />
                </div>
                <h4 className="text-lg text-center mt-5">Layout - 4</h4>
              </a>
             <Link className="group" href="index-5.html" target="_blank">
                <div className="rounded-xl overflow-hidden border border-gray-200">
                  <Image
                    src={demobg5}
                    className="rounded transition-all duration-500 shadow group-hover:shadow-sm group-hover:scale-110"
                    alt="work-image"
                  />
                </div>
                <h4 className="text-lg text-center mt-5">Layout - 5</h4>
              </a>
             <Link className="group" href="index-6.html" target="_blank">
                <div className="rounded-xl overflow-hidden border border-gray-200">
                  <Image
                    src={demobg6}
                    className="rounded transition-all duration-500 shadow group-hover:shadow-sm group-hover:scale-110"
                    alt="work-image"
                  />
                </div>
                <h4 className="text-lg text-center mt-5">Layout - 6</h4>
              </a> */}
              {/* <div className="lg:col-span-2">
                <div className="flex justify-center">
                  <div className="lg:w-1/2">
                   <Link className="group" href="index-7.html" target="_blank">
                      <div className="rounded-xl overflow-hidden border border-gray-200">
                        <Image
                          src={demobg7}
                          className="rounded transition-all duration-500 shadow group-hover:shadow-sm group-hover:scale-110"
                          alt="work-image"
                        />
                      </div>
                      <h4 className="text-lg text-center mt-5">Layout - 7</h4>
                    </a>
                  </div>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Demos;
