import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';
import './style/comunidadSection.css';

function StarCircle({ calificacion }) {
  return (
    <div className="star-circle">
      <span className="star-value">{calificacion}</span>
      <span className="star-icon">★</span>
    </div>
  );
}

export default function ComunidadSection({ testimonios }) {
  const [expanded, setExpanded] = useState({});

  const handleExpand = (idx) => {
    setExpanded((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <section data-aos="fade-up" className="comunidad-section">
      <h2>Comunidad</h2>
      <h3>Estos son algunos testimonios de las personas que han confiado en Psicoeduca</h3>
 <div className="comunidad-swiper-container">
      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={24}
        slidesPerView={3}
        navigation={{
          nextEl: ".comunidad-next",
          prevEl: ".comunidad-prev",
        }}
        loop={true}
        autoplay={{ delay: 7000, disableOnInteraction: false }}
        breakpoints={{
          1024: { slidesPerView: 3 },
          768: { slidesPerView: 2 },
          0: { slidesPerView: 1 },
        }}
        className="comunidad-swiper"
      >

        {testimonios.map((t, idx) => (
          <SwiperSlide key={idx}>
            <div className="comunidad-card">
              {t.foto && <img src={t.foto} alt={t.nombre} className="comunidad-foto" />}
              <StarCircle calificacion={t.calificacion || 5} />

              <div className="comunidad-nombre">{t.nombre}</div>
              <div className="comunidad-servicio">{t.servicio}</div>

              <div className="comunidad-comentario">
                “
                {expanded[idx]
                  ? t.comentario
                  : t.comentario.length > 80
                  ? t.comentario.slice(0, 80).trim() + '...'
                  : t.comentario}
                ”
                {t.comentario.length > 80 && (
                  <span
                    className="comunidad-expand"
                    onClick={() => handleExpand(idx)}
                  >
                    {expanded[idx] ? ' Ver menos' : ' Ver más'}
                  </span>
                )}
              </div>
            </div>
          </SwiperSlide>
         
        ))}
        
      </Swiper>
       {/* 🔹 Flechas fuera de las slides */}
    <div className="comunidad-prev">‹</div>
    <div className="comunidad-next">›</div>
    </div>
    </section>
  );
}
