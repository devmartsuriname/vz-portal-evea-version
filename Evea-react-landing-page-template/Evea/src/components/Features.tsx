import feature from "@/assets/images/feature.jpg";
import IconifyIcon from './wrappers/IconifyIcon'
import { Link } from "react-router-dom";

const Features = () => {
  return (
    <section id="features" className="py-20">
    <div className="container">
      <div className="grid lg:grid-cols-2 items-center gap-6">
        <div className="flex items-center">
          <img
            src={feature}
            className="h-[650px] rounded-xl mx-auto"
            alt="feature section"
            width={433}
            height={650}
          />
        </div>
        <div className="lg:ms-5 ms-8">
          <span className="text-sm text-primary uppercase font-semibold tracking-wider text-default-950">
            Focused on achievind
          </span>
          <h2 className="text-3xl md:text-4xl/tight font-semibold text-black mt-4">
            Achievement Via Our Distinct Methodology
          </h2>
          <Link 
            to="#"
            className="inline-flex items-center justify-center gap-3 text-sm font-medium text-black mt-6"
          >
            Learn More
            <IconifyIcon icon="lucide:move-right" />
          </Link>
          <hr className="border-gray-200 my-6" />
          <div className="flex items-start gap-5">
            <div>
              <div className="w-12 h-12 rounded-full border border-dashed border-primary/40 bg-primary/10 flex items-center justify-center">
                <IconifyIcon
                  icon="lucide:check"
                  className="text-base text-blue-600"
                />
              </div>
            </div>
            <div>
              <h4 className="text-xl font-semibold">
                Manage markets with empowerment
              </h4>
              <p className="text-base font-normal text-gray-500 mt-2">
                Empower yourself to effectively manage markets with
                confidence. utilizing strategic insights and resources for
                success.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-5 mt-8">
            <div>
              <div className="w-12 h-12 rounded-full border border-dashed border-primary/40 bg-primary/10 flex items-center justify-center">
                <IconifyIcon
                  icon="lucide:layers-2"
                  className="text-base text-blue-600"
                />
              </div>
            </div>
            <div>
              <h4 className="text-xl font-semibold">
                Manage your design and architecture
              </h4>
              <p className="text-base font-normal text-gray-500 mt-2">
                Achieve task completion optimization by effectively managing
                time and resources, ensuring timely delivery and efficiency.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-5 mt-8">
            <div>
              <div className="w-12 h-12 rounded-full border border-dashed border-primary/40 bg-primary/10 flex items-center justify-center">
                <IconifyIcon
                  icon="lucide:lock"
                  className="text-base text-blue-600"
                />
              </div>
            </div>
            <div>
              <h4 className="text-xl font-semibold">
                Presentations in real-time
              </h4>
              <p className="text-base font-normal text-gray-500 mt-2">
                Empower yourself to effectively manage markets with
                confidence. utilizing strategic insights and resources for
                success.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
)
}

export default Features