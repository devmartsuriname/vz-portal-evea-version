import vector from "@/assets/images/vector/vector-1.png";
import vector2 from "@/assets/images/vector/vector-2.png";
import vector3 from "@/assets/images/vector/vector-3.png";import IconifyIcon from './wrappers/IconifyIcon'

const Pricing = () => {
  return (

    <section id="pricing" className="py-20">
    <div className="container">
      <div className="max-w-2xl mx-auto text-center">
        <div>
          <span className="text-sm text-primary uppercase font-semibold tracking-wider text-default-950">
            Pricing
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl/tight font-semibold text-black mt-4">
          Get the power of the professional services with the simple price
        </h2>
      </div>
      <div className="grid grid-cols-1 mt-8">
        <div className="flex justify-center">
          <div
            id="toggle-count"
            className="p-1 inline-block border border-gray-200 rounded-lg"
          >
            <span className="relative inline-block">
              <input
                id="toggle-count-monthly"
                name="toggle-count"
                type="radio"
                className="absolute top-0 end-0 size-full border-transparent bg-transparent bg-none text-white rounded-lg cursor-pointer focus:border-0 focus:ring-transparent focus:ring-offset-transparent"
                defaultChecked
              />
              <label
                htmlFor="toggle-count-monthly"
                className="inline-block py-2 px-5 rounded-s-md uppercase text-sm font-semibold"
              >
                Monthly
              </label>
            </span>
            <span className="relative inline-block">
              <input
                id="toggle-count-annual"
                name="toggle-count"
                type="radio"
                className="absolute top-0 end-0 size-full border-transparent bg-transparent bg-none text-white rounded-lg cursor-pointer focus:border-0 focus:ring-transparent focus:ring-offset-transparent"
              />
              <label
                htmlFor="toggle-count-annual"
                className="inline-block py-2 px-5 rounded-e-md uppercase text-sm font-semibold"
              >
                Annual
              </label>
            </span>
          </div>
        </div>
        <p className="text-muted text-base mx-auto mt-5">
          Save up to 15% with Annual Plan.
        </p>
        <div id="StarterContent">
          <div
            className="mt-14"
            id="start-month"
            role="tabpanel"
            aria-labelledby="start-month-tab"
          >
            <div className="grid lg:grid-cols-3 grid-cols-1 gap-10">
              <div className="flex flex-col shadow-2xl rounded-xl bg-white overflow-hidden">
                <div className="text-center pt-10">
                  <img
                    src={vector}
                    className="h-28 w-28 mx-auto"
                    alt="email"
                  />
                  <h5 className="text-2xl font-semibold text-black">
                    Standard
                  </h5>
                  <h2 className="text-5xl mt-5 mb-1 items-center align-middle">
                    <sup className="text-3xl align-middle">$</sup>
                    <span
                      data-hs-toggle-count='{
                              "target": "#toggle-count",
                              "min": 49,
                              "max": 199
                            }'
                    >
                      49
                    </span>
                  </h2>
                  <span className="text-base font-medium text-muted">
                    per month
                  </span>
                </div>
                <div className="px-5 py-5 mx-auto">
                  <ul className="text-center">
                    <li className="flex items-center justify-start py-2">
                      <IconifyIcon
                        icon="lucide:check"
                        className="text-primary text-lg align-middle me-2"
                      />
                      <h5 className="font-medium">1 Gb Storage</h5>
                    </li>
                    <li className="flex items-center justify-start py-2">
                      <IconifyIcon
                        icon="lucide:check"
                        className="text-primary text-lg align-middle me-2"
                      />
                      <h5 className="font-medium">3 Domain Names</h5>
                    </li>
                    <li className="flex items-center justify-start py-2">
                      <IconifyIcon
                        icon="lucide:check"
                        className="text-primary text-lg align-middle me-2"
                      />
                      <h5 className="font-medium">5 FTP Users</h5>
                    </li>
                    <li className="flex items-center justify-start py-2">
                      <IconifyIcon
                        icon="lucide:x"
                        className="text-muted text-lg align-middle me-2"
                      />
                      <h5 className="font-medium text-muted">
                        Free Support
                      </h5>
                    </li>
                    <li className="flex items-center justify-start py-2">
                      <IconifyIcon
                        icon="lucide:x"
                        className="text-muted text-lg align-middle me-2"
                      />
                      <h5 className="font-medium text-muted">
                        Free SSI Certificate
                      </h5>
                    </li>
                  </ul>
                </div>
                <div className="flex justify-center px-10 pb-10">
                  <button className="py-2 px-6 inline-flex rounded-md text-base items-center justify-center border border-primary text-white bg-primary hover:bg-primaryDark transition-all duration-500 font-medium w-full">
                    Buy Standard
                  </button>
                </div>
              </div>
              <div className="flex flex-col shadow-2xl rounded-xl bg-white overflow-hidden">
                <div className="text-center pt-10">
                  <img
                    src={vector2}
                    className="h-28 w-28 mx-auto"
                    alt="vector-2"
                  />
                  <h5 className="text-2xl font-semibold text-black">
                    Premium
                  </h5>
                  <h2 className="text-5xl mt-5 mb-1 items-center align-middle">
                    <sup className="text-3xl align-middle">$</sup>
                    <span
                      data-hs-toggle-count='{
                              "target": "#toggle-count",
                              "min": 78,
                              "max": 299
                            }'
                    >
                      78
                    </span>
                  </h2>
                  <span className="text-base font-medium text-muted">
                    per month
                  </span>
                </div>
                <div className="px-5 py-5 mx-auto">
                  <ul className="text-center text-black">
                    <li className="flex items-center justify-start py-2">
                      <IconifyIcon
                        icon="lucide:check"
                        className="text-primary text-lg align-middle me-2"
                      />
                      <h5 className="font-medium">1 Gb Storage</h5>
                    </li>
                    <li className="flex items-center justify-start py-2">
                      <IconifyIcon
                        icon="lucide:check"
                        className="text-primary text-lg align-middle me-2"
                      />
                      <h5 className="font-medium">3 Domain Names</h5>
                    </li>
                    <li className="flex items-center justify-start py-2">
                      <IconifyIcon
                        icon="lucide:check"
                        className="text-primary text-lg align-middle me-2"
                      />
                      <h5 className="font-medium">5 FTP Users</h5>
                    </li>
                    <li className="flex items-center justify-start py-2">
                      <IconifyIcon
                        icon="lucide:check"
                        className="text-primary text-lg align-middle me-2"
                      />
                      <h5 className="font-medium">Free Support</h5>
                    </li>
                    <li className="flex items-center justify-start py-2">
                      <IconifyIcon
                        icon="lucide:x"
                        className="text-muted text-lg align-middle me-2"
                      />
                      <h5 className="font-medium text-muted">
                        Free SSI Certificate
                      </h5>
                    </li>
                  </ul>
                </div>
                <div className="flex justify-center px-10 pb-10">
                  <button className="py-2 px-6 inline-flex rounded-md text-base items-center justify-center border border-primary text-white bg-primary hover:bg-primaryDark transition-all duration-500 font-medium w-full">
                    Buy Premium
                  </button>
                </div>
              </div>
              <div className="flex flex-col shadow-2xl rounded-xl bg-white overflow-hidden ">
                <div className="text-center pt-10">
                  <img
                    src={vector3}
                    className="h-28 w-28 mx-auto"
                    alt="vector-3"
                  />
                  <h5 className="text-2xl font-semibold text-black">
                    Enterprise
                  </h5>
                  <h2 className="text-5xl mt-5 mb-1 items-center align-middle">
                    <sup className="text-3xl align-middle">$</sup>
                    <span
                      data-hs-toggle-count='{
                              "target": "#toggle-count",
                              "min": 99,
                              "max": 399
                            }'
                    >
                      99
                    </span>
                  </h2>
                  <span className="text-base font-medium text-muted">
                    per month
                  </span>
                </div>
                <div className="px-5 py-5 mx-auto">
                  <ul className="text-center text-black">
                    <li className="flex items-center justify-start py-2">
                      <IconifyIcon
                        icon="lucide:check"
                        className="text-primary text-lg align-middle me-2"
                      />
                      <h5 className="font-medium">1 Gb Storage</h5>
                    </li>
                    <li className="flex items-center justify-start py-2">
                      <IconifyIcon
                        icon="lucide:check"
                        className="text-primary text-lg align-middle me-2"
                      />
                      <h5 className="font-medium">3 Domain Names</h5>
                    </li>
                    <li className="flex items-center justify-start py-2">
                      <IconifyIcon
                        icon="lucide:check"
                        className="text-primary text-lg align-middle me-2"
                      />
                      <h5 className="font-medium">5 FTP Users</h5>
                    </li>
                    <li className="flex items-center justify-start py-2">
                      <IconifyIcon
                        icon="lucide:check"
                        className="text-primary text-lg align-middle me-2"
                      />
                      <h5 className="font-medium">Free Support</h5>
                    </li>
                    <li className="flex items-center justify-start py-2">
                      <IconifyIcon
                        icon="lucide:check"
                        className="text-primary text-lg align-middle me-2"
                      />
                      <h5 className="font-medium">Free SSI Certificate</h5>
                    </li>
                  </ul>
                </div>
                <div className="flex justify-center px-10 pb-10">
                  <button className="py-2 px-6 inline-flex rounded-md text-base items-center justify-center border border-primary text-white bg-primary hover:bg-primaryDark transition-all duration-500 font-medium w-full">
                    Buy Enterprise
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>  )
}

export default Pricing