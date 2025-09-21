import iphone from "@/assets/images/feature-iphone.png";
import IconifyIcon from './wrappers/IconifyIcon'

const About = () => {
  return (
<section id="about" className="py-20">
        <div className="container">
          <div className="grid lg:grid-cols-2 items-center gap-6">
            <div className="lg:ms-5 ms-8">
              <div>
                <span className="text-sm text-primary uppercase font-semibold tracking-wider text-default-950">
                  Services
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl/tight font-semibold text-black mt-4">
                Get Started In Minutes: Download The App, Create Your Profile
              </h2>
              <p className="text-base font-normal text-muted mt-6">
                Digital payment has revolutionized the way we make financial
                transactions today With Rible you can enjoy the convenience of
                making secure &amp; hassle-free payments online. Our platform
                provides you with a quick and eary.
              </p>
              <div className="grid lg:grid-cols-3 grid-cols-1 gap-8 mt-9">
                <div className="">
                  <div className="flex items-center justify-start">
                    <div className="items-center justify-center flex bg-green-50 rounded-full h-20 w-20 border border-dashed border-green-50">
                      <IconifyIcon
                        icon="lucide:smartphone"
                        className="h-8 w-8 text-black"
                      />
                    </div>
                  </div>
                  <h1 className="text-xl font-semibold pt-6">1. Download</h1>
                  <p className="text-base text-gray-600 font-normal mt-2">
                    Join the millions already benefitting from.
                  </p>
                </div>
                <div className="">
                  <div className="flex items-center justify-start">
                    <div className="items-center justify-center flex bg-red-50 rounded-full h-20 w-20 border border-dashed border-red-50">
                      <IconifyIcon
                        icon="lucide:file-text"
                        className="h-8 w-8 text-black"
                      />
                    </div>
                  </div>
                  <h1 className="text-xl font-semibold  pt-6">
                    2. Set Profile
                  </h1>
                  <p className="text-base text-gray-600 font-normal mt-2">
                    Join the millions already benefitting from.
                  </p>
                </div>
                <div className="">
                  <div className="flex items-center justify-start">
                    <div className="items-center justify-center flex bg-primary/10 rounded-full h-20 w-20 border border-dashed border-primary/10">
                      <IconifyIcon
                        icon="lucide:rocket"
                        className="h-8 w-8 text-black"
                      />
                    </div>
                  </div>
                  <h1 className="text-xl font-semibold pt-6">3. Start</h1>
                  <p className="text-base text-gray-600 font-normal mt-2">
                    Join the millions already benefitting from.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <img
                src={iphone}
                className="h-[600px] rounded-xl mx-auto"
                alt="feature-image"
                width={538}
                height={600}
              />
            </div>
          </div>
        </div>
      </section>  )
}

export default About