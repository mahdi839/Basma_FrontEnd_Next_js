import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';

function Feature() {
  return (
    <section className="categories">
      <div className="container">
        <div className="row">
          <Swiper
            spaceBetween={10}
            slidesPerView={4}
            loop={true}
            autoplay={{ delay: 3000 }}
            navigation
          >
            <SwiperSlide>
              <div className="categories__item set-bg" style={{ backgroundImage: `url('/img/categories/cat-1.jpg')` }}>
                <h5><a href="#">Fresh Fruit</a></h5>
              </div>
            </SwiperSlide>
            {/* Add additional SwiperSlides here */}
          </Swiper>
        </div>
      </div>
    </section>
  );
}

export default Feature;
