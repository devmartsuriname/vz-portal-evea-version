import { Link } from 'react-router-dom'
import IconifyIcon from './wrappers/IconifyIcon'

const Contact = () => {
  return (
    <section id="contact" className="py-20 bg-gray-50">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-6 items-center">
            <div>
              <div>
                <span className="text-sm text-primary uppercase font-semibold tracking-wider text-default-950 mb-6">
                  Contact Us
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl/tight font-semibold mt-4">
                We're open to talk to good people.
              </h2>
              <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-start mt-10">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <IconifyIcon
                    icon="lucide:map-pin"
                    className="text-2xl text-primary"
                  />
                </div>
                <div>
                  <h5 className="text-base text-muted font-medium mb-1">
                    123 King Street, London W60 10250
                  </h5>
                  <Link 
                    to="#"
                    className="text-xs text-primary font-bold uppercase"
                  >
                    See more
                  </Link>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-start mt-10">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <IconifyIcon
                    icon="lucide:mail"
                    className="text-2xl text-primary"
                  />
                </div>
                <div>
                  <h5 className="text-base text-muted font-medium mb-1">
                    support@zoyothemes.com
                  </h5>
                  <Link 
                    to="#"
                    className="text-xs text-primary font-bold uppercase"
                  >
                    Say hello
                  </Link>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-start mt-10">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <IconifyIcon
                    icon="lucide:smartphone"
                    className="text-2xl text-primary"
                  />
                </div>
                <div>
                  <h5 className="text-base text-muted font-medium mb-1">
                    (+01) 1234 5678 00
                  </h5>
                  <Link 
                    to="#"
                    className="text-xs text-primary font-bold uppercase"
                  >
                    call now
                  </Link>
                </div>
              </div>
            </div>
            <div className="lg:col-span-2 lg:ms-24">
              <div className="p-6 md:p-12 rounded-md shadow-lg bg-white">
                <form>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="formFirstName"
                        className="block text-sm/normal font-semibold text-black mb-2"
                      >
                        First Name
                      </label>
                      <input
                        type="text"
                        className="block w-full text-sm rounded-md py-3 px-4 border-gray-200 focus:border-gray-300 focus:ring-transparent"
                        id="formFirstName"
                        placeholder="Your first name..."
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="formLastName"
                        className="block text-sm/normal font-semibold text-black mb-2"
                      >
                        Last Name
                      </label>
                      <input
                        type="text"
                        className="block w-full text-sm rounded-md py-3 px-4 border-gray-200 focus:border-gray-300 focus:ring-transparent"
                        id="formLastName"
                        placeholder="Last first name..."
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="formEmail"
                        className="block text-sm/normal font-semibold text-black mb-2"
                      >
                        Email Address
                      </label>
                      <input
                        type="email"
                        className="block w-full text-sm rounded-md py-3 px-4 border-gray-200 focus:border-gray-300 focus:ring-transparent"
                        id="formEmail"
                        placeholder="Your email..."
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="formPhone"
                        className="block text-sm/normal font-semibold text-black mb-2"
                      >
                        Phone Number
                      </label>
                      <input
                        type="text"
                        className="block w-full text-sm rounded-md py-3 px-4 border-gray-200 focus:border-gray-300 focus:ring-transparent"
                        id="formPhone"
                        placeholder="Type phone number..."
                        required
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <div className="mb-4">
                        <label
                          htmlFor="formMessages"
                          className="block text-sm/normal font-semibold text-black mb-2"
                        >
                          Messages
                        </label>
                        <textarea
                          className="block w-full text-sm rounded-md py-3 px-4 border-gray-200 focus:border-gray-300 focus:ring-transparent"
                          id="formMessages"
                          rows={4}
                          placeholder="Type messages..."
                          required
                          defaultValue={""}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <button
                      type="submit"
                      className="py-2 px-6 rounded-md text-baseitems-center justify-center border border-primary text-white bg-primary hover:bg-primaryDark transition-all duration-500 font-medium"
                    >
                      Send Messages{" "}
                      <IconifyIcon
                        icon="lucide:send"
                        className="mdi mdi-send ms-1"
                      />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

  )
}

export default Contact