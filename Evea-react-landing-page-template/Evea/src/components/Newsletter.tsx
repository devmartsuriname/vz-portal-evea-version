import home from "@/assets/images/home/parallax.png";


const Newsletter = () => {
  return (
    <section
    className="relative py-20 bg-cover bg-no-repeat bg-center bg-fixed"
    style={{ backgroundImage: `url(${home})` }}
    data-jarallax
    data-speed="0.20"
  >
    <div className="absolute inset-0 w-full h-full bg-gray-900/70" />
    <div className="container">
      <div className="pb-10 lg:pb-0 flex flex-col items-center justify-center">
        <h1 className="text-3xl md:text-4xl/tight font-semibold text-white text-center">
          A Detailed Examination Of A Specific Case
        </h1>
        <p className="text-base font-normal max-w-xl text-center mx-auto text-white mt-6">
          Together, we manage and empower markets by utilizing both
          established and emerging channels for potential growth.
        </p>
        <div className="flex flex-wrap mt-6 gap-3">
          <button className="py-2 px-6 rounded-md text-white text-base bg-primary hover:bg-primaryDark border border-primary hover:border-primaryDark transition-all duration-500 font-medium">
            Join Now
          </button>
          <button className="py-2 px-6 rounded-md border border-white text-base hover:border-white hover:bg-white hover:text-primary transition-all duration-500 font-medium text-white ">
            See Video
          </button>
        </div>
      </div>
    </div>
  </section>  )
}

export default Newsletter