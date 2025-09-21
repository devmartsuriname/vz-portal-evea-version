import client03 from "@/assets/images/user/client-03.jpg";
import client05 from "@/assets/images/user/client-05.jpg";
import blog5 from "@/assets/images/blog/05.jpg";
import blog7 from "@/assets/images/blog/07.jpg";
import user3 from "@/assets/images/user/client-03.jpg";
import blog4 from "@/assets/images/blog/04.jpg";
import { Link } from "react-router-dom";
const Blog = () => {
  return (
    <section id="blog" className="py-20">
    <div className="container">
      <div className="">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-sm text-primary uppercase font-semibold tracking-wider text-default-950">
            Blog
          </span>
          <h2 className="text-3xl md:text-4xl/tight font-semibold mt-4">
            Check the latest news about our company in our blog.
          </h2>
        </div>
      </div>
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6 mt-14 items-center">
        <div className="bg-white rounded-xl border">
          <div className="relative">
            <img className="rounded-t-xl" src={blog5} alt="" />
          </div>
          <div className="flex py-6 px-6">
            <div>
              <Link
                to="#"
                className="text-xl text-black font-semibold line-clamp-2"
              >
                Spotlight — Equinox Collection by Shane Griffin
              </Link>
              <p className="mt-4 mb-6 text-gray-500 leading-6">
                As I searched for inspiration to get started, I came across
                the captivating creations of Shane Griffin, an artist and
                director located in New York City...
              </p>
              <div className="flex items-center justify-between gap-3 mt-4">
                <div className="flex items-center">
                  <img
                    src={client05}
                    className="h-10 w-10 me-4 rounded-full"
                    alt=""
                  />
                  <Link
                    to="#"
                    className="text-black text-sm font-semibold pb-1 hover:underline hover:text-primary transition-all duration-300"
                  >
                    Credon catla
                  </Link>
                </div>
                <p className="flex font-medium text-muted">August 2</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border">
          <div className="relative">
            <img className="rounded-t-xl" src={blog7} alt="" />
          </div>
          <div className="flex py-6 px-6">
            <div>
              <Link
                to="#"
                className="text-xl text-black font-semibold line-clamp-2"
              >
                Random Explorations with Cinema 4D and Redshift
              </Link>
              <p className="mt-4 mb-6 text-gray-500 leading-6">
                As I searched for inspiration to get started, I came across
                the captivating creations of Shane Griffin, an artist and
                director located in New York City...
              </p>
              <div className="flex items-center justify-between gap-3 mt-4">
                <div className="flex items-center">
                  <img
                    src={client03}
                    className="h-10 w-10 me-4 rounded-full"
                    alt=""
                  />
                  <Link
                    to="#"
                    className="text-black text-sm font-semibold pb-1 hover:underline hover:text-primary transition-all duration-300"
                  >
                    Jessica Smith
                  </Link>
                </div>
                <p className="flex font-medium text-muted">August 3</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border">
          <div className="relative">
            <img className="rounded-t-xl" src={blog4} alt="" />
          </div>
          <div className="flex py-6 px-6">
            <div>
              <Link
                to="/"
                className="text-xl text-black font-semibold line-clamp-2"
              >
                Step by step guide for conducting usability
              </Link>
              <p className="mt-4 mb-6 text-gray-500 leading-6">
                As I searched for inspiration to get started, I came across
                the captivating creations of Shane Griffin, an artist and
                director located in New York City...
              </p>
              <div className="flex items-center justify-between gap-3 mt-4">
                <div className="flex items-center">
                  <img
                    src={user3}
                    className="h-10 w-10 me-4 rounded-full"
                    alt=""
                  />
                  <Link
                    to="#"
                    className="text-black text-sm font-semibold pb-1 hover:underline hover:text-primary transition-all duration-300"
                  >
                    Petric Camp
                  </Link>
                </div>
                <p className="flex font-medium text-muted">August 8</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
)
}

export default Blog