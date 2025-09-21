import IconifyIcon from '@/components/wrappers/IconifyIcon'
import store from "@/assets/images/store.png";
import google from "@/assets/images/google.png";
import furniture from "@/assets/images/furniture.png";

const Hero = () => {
  return (
    <section
    className="relative pt-32 pb-32 overflow-x-hidden from-slate-500/10 bg-[url(../images/home/bg-1.png)]  bg-no-repeat bg-cover"
    id="home"
  >
    <div className="container">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 items-center">
        <div className="text-sm py-20 px-10">
          <span className="inline-flex py-2 text-lg text-black font-medium items-center justify-center rounded-full">
            <IconifyIcon icon="lucide:minus" /> The Best Online Furniture
            Store
          </span>
          <h1 className="md:text-6xl/tight text-4xl text-dark tracking-normal leading-normal font-bold mb-4 mt-6">
            The Best Selection of{" "}
            <span className="text-primary"> Furniture Online </span>
          </h1>
          <p className="text-base font-medium text-muted leading-7 mt-5 capitalize">
            Online furniture apps simplify home shopping with convenience,
            variety, and affordability. Browse easily, compare prices.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-normal mt-9">
            <img
              src={store}
              className="h-14"
              alt="apple image"
              width={190}
              height={56}
            />
            <img
              src={google}
              className="h-14"
              alt="google image"
              width={189}
              height={56}
            />
          </div>
        </div>
        <div className="mt-4 pt-2 sm:mt-0 sm:pt-0 relative">
          <img
            src={furniture}
            alt="furniture img"
            className="h-[600px]  max-w-full mx-auto"
            width={295}
            height={600}
          />
          <div className="absolute bottom-3/4 -end-14 2xl:end-8 hidden xl:block">
            <div className="flex items-center gap-2 p-2 pe-6 rounded-full bg-white shadow-2xl">
              <div className="rounded-full bg-primary h-9 w-9 items-center justify-center flex">
                <IconifyIcon
                  icon="lucide:codesandbox"
                  className="h-6 w-6 text-white"
                />
              </div>
              <div className="">
                <h6 className="text-base font-medium text-default-900">
                  Express Delivery Service
                </h6>
              </div>
            </div>
          </div>
          <div className="absolute bottom-28 start-6 hidden xl:block">
            <div className="flex items-center gap-2 p-2 pe-6 rounded-full bg-white shadow-2xl">
              <div className="rounded-full bg-primary h-9 w-9 items-center justify-center flex">
                <IconifyIcon
                  icon="lucide:headset"
                  className="h-6 w-6 text-white"
                />
              </div>
              <div className="">
                <h6 className="text-base font-medium text-default-900">
                  24x7 Customer Support
                </h6>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>  )
}

export default Hero