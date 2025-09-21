import IconifyIcon from './wrappers/IconifyIcon'

const Services = () => {
  return (
<section id="services" className="py-20">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <span className="text-sm text-primary uppercase font-semibold tracking-wider text-default-950">
              Services
            </span>
            <h2 className="text-3xl md:text-4xl/tight font-semibold text-black mt-4">
              Build a customer - centric marketing strategy
            </h2>
            <p className="text-base font-medium mt-4 text-muted">
              Ligula risus auctor tempus magna feugit lacinia.
            </p>
          </div>
          <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-x-3 gap-y-6 md:gap-y-12 lg:gap-y-24 md:pt-20 pt-12">
            <div className="text-center">
              <div className="flex items-center justify-center">
                <div className="items-center justify-center flex bg-primary/10 rounded-[49%_80%_40%_90%_/_50%_30%_70%_80%] h-20 w-20 border">
                  <IconifyIcon
                    icon="lucide:menu"
                    className="h-10 w-10 text-primary"
                  />
                </div>
              </div>
              <h1 className="text-xl font-semibold pt-4">Market Research</h1>
              <p className="text-base text-gray-600 mt-2">
                Gain a comprehensive understanding of your industry landscape.
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center">
                <div className="items-center justify-center flex bg-primary/10 rounded-[49%_80%_40%_90%_/_50%_30%_70%_80%] h-20 w-20 border">
                  <IconifyIcon
                    icon="lucide:lightbulb"
                    className="h-10 w-10 text-primary"
                  />
                </div>
              </div>
              <h1 className="text-xl font-semibold pt-4">User Experience</h1>
              <p className="text-base text-gray-600 mt-2">
                Evaluate the viability and potential of new products or
                services.
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center">
                <div className="items-center justify-center flex bg-primary/10 rounded-[49%_80%_40%_90%_/_50%_30%_70%_80%] h-20 w-20 border">
                  <IconifyIcon
                    icon="lucide:bar-chart-big"
                    className="h-10 w-10 text-primary"
                  />
                </div>
              </div>
              <h1 className="text-xl font-semibold pt-4">Digital Marketing</h1>
              <p className="text-base text-gray-600 mt-2">
                Benchmark your performance against competitors, identify
                strengths.
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center">
                <div className="items-center justify-center flex bg-primary/10 rounded-[49%_80%_40%_90%_/_50%_30%_70%_80%] h-20 w-20 border">
                  <IconifyIcon
                    icon="lucide:codepen"
                    className="h-10 w-10 text-primary"
                  />
                </div>
              </div>
              <h1 className="text-xl font-semibold pt-4">SEO Services</h1>
              <p className="text-base text-gray-600 mt-2">
                Anticipate market shifts and emerging trends to stay ahead of
                the curve.
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center">
                <div className="items-center justify-center flex bg-primary/10 rounded-[49%_80%_40%_90%_/_50%_30%_70%_80%] h-20 w-20 border">
                  <IconifyIcon
                    icon="lucide:shield"
                    className="h-10 w-10 text-primary"
                  />
                </div>
              </div>
              <h1 className="text-xl font-semibold pt-4">Market Research</h1>
              <p className="text-base text-gray-600 mt-2">
                Our market research services are designed to provide maximum
                value.
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center">
                <div className="items-center justify-center flex bg-primary/10 rounded-[49%_80%_40%_90%_/_50%_30%_70%_80%] h-20 w-20 border">
                  <IconifyIcon
                    icon="lucide:rocket"
                    className="h-10 w-10 text-primary"
                  />
                </div>
              </div>
              <h1 className="text-xl font-semibold pt-4">
                Software Development
              </h1>
              <p className="text-base text-gray-600 mt-2">
                We go beyond data collection to provide actionable insights.
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center">
                <div className="items-center justify-center flex bg-primary/10 rounded-[49%_80%_40%_90%_/_50%_30%_70%_80%] h-20 w-20 border">
                  <IconifyIcon
                    icon="lucide:layers-2"
                    className="h-10 w-10 text-primary"
                  />
                </div>
              </div>
              <h1 className="text-xl font-semibold pt-4">
                Affiliate Marketing
              </h1>
              <p className="text-base text-gray-600 mt-2">
                We understand that every business is unique. That's why we
                offer.
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center">
                <div className="items-center justify-center flex bg-primary/10 rounded-[49%_80%_40%_90%_/_50%_30%_70%_80%] h-20 w-20 border">
                  <IconifyIcon
                    icon="lucide:webcam"
                    className="h-10 w-10 text-primary"
                  />
                </div>
              </div>
              <h1 className="text-xl font-semibold pt-4">
                Website Development
              </h1>
              <p className="text-base text-gray-600 mt-2">
                In today's competitive market, timing is everything. Our
                efficient.
              </p>
            </div>
          </div>
        </div>
      </section>  )
}

export default Services