'use client'
import { sliderData } from '@/components/data';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { FreeMode, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css'

const Swiperslider = () => {
  return (
    <section id="testimonial" className="py-20">
    <div className="container">
      <div className="">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-sm text-primary uppercase font-semibold tracking-wider text-default-950">
            Our Clients
          </span>
          <h2 className="text-3xl md:text-4xl/tight font-semibold mt-4">
            Stories From Our Customers
          </h2>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 mt-14 items-center">
        <div className="relative">
          <Swiper
            className="swiper testi-swiper rounded-md relative px-1"
            modules={[FreeMode, Navigation]}
            centeredSlides
            spaceBetween={24}
            loop
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            navigation={{
              nextEl: ".testi-button-next",
              prevEl: ".testi-button-prev",
            }}
            breakpoints={{
              0: {
                slidesPerView: 1,
              },
              768: {
                slidesPerView: 2,
              },
              991: {
                slidesPerView: 2.5,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
          >
            {/* <div className="swiper-wrapper"> */}
            {sliderData.map((item, index) => {
              return (
                <SwiperSlide className="swiper-slide" key={index}>
                  <div className="p-6 rounded-xl border border-default-200">
                    <h3 className="text-xl font-semibold text-default-950">
                      {item.title}
                    </h3>
                    <p className="text-base font-normal mt-4 mb-4 text-muted">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-4">
                      <div>
                        <img
                          src={item.image}
                          className="h-12 rounded-full"
                          alt=""
                          width={48}
                          height={48}
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-primary">
                          {item.name}
                        </h3>
                        <p className="text-sm font-medium mt-1">
                          {item.catageries}
                        </p>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
          <div className="flex items-center justify-center gap-3 w-full relative mt-10">
            <div className="testi-button-prev">
              <div className="h-11 w-11 rounded-full shadow border border-default-300 bg-default-100 text-default-900 hover:bg-primary hover:border-primary hover:text-white flex items-center justify-center transition-all duration-300">
                <IconifyIcon
                  icon="lucide:chevron-left"
                  className="h-6 w-6"
                />
              </div>
            </div>
            <div className="testi-button-next">
              <div className="h-11 w-11 rounded-full shadow border border-default-300 bg-default-100 text-default-900 hover:bg-primary hover:border-primary hover:text-white flex items-center justify-center transition-all duration-300">
                <IconifyIcon
                  icon="lucide:chevron-right"
                  className="h-6 w-6"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
)
}

export default Swiperslider