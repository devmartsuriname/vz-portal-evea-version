
import amazon from "@/assets/images/client/amazon.svg";
import lenovo from "@/assets/images/client/lenovo.svg";
import google2 from "@/assets/images/client/google.svg";
import paypal from "@/assets/images/client/paypal.svg";
import shopify from "@/assets/images/client/shopify.svg";
import spotify from "@/assets/images/client/spotify.svg";
const Testimonials = () => {
  return (
<section className="py-20 bg-gray-50">
        <div className="container relative">
          <div className="">
            <div className="text-center max-w-xl mx-auto">
              <h3 className="text-3xl md:text-4xl/tight font-semibold">
                Trusted by Leading Companies
              </h3>
            </div>
          </div>
          <div className="grid md:grid-cols-6 grid-cols-2 justify-center gap-[30px] mt-14">
            <div className="mx-auto py-4">
              <img src={amazon} className="h-10" alt="" />
            </div>
            <div className="mx-auto py-4">
              <img src={google2} className="h-10" alt="" />
            </div>
            <div className="mx-auto py-4">
              <img src={lenovo} className="h-10" alt="" />
            </div>
            <div className="mx-auto py-4">
              <img src={paypal} className="h-10" alt="" />
            </div>
            <div className="mx-auto py-4">
              <img src={shopify} className="h-10" alt="" />
            </div>
            <div className="mx-auto py-4">
              <img src={spotify} className="h-10" alt="" />
            </div>
          </div>
        </div>
      </section>
  )
}

export default Testimonials