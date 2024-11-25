"use client";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCards,Autoplay } from "swiper/modules";
import { Pagination } from "swiper/modules";
import { DATA } from "@/data/resume";
import BlurFade from "./magicui/blur-fade";

const BLUR_FADE_DELAY = 0.04;

// Import Swiper styles

import "swiper/css";
import "swiper/css/effect-cards";
import "swiper/css/pagination";
import "./lang-swipper.css";
import Image from "next/image";

type SwipperProps = {
  blur_delay: number;
};

export const LangSwipper = (props: SwipperProps) => {
  return (
    <BlurFade delay={props.blur_delay}>
      <Swiper
        effect={"cards"}
        grabCursor={true}
        modules={[EffectCards,Autoplay]}
        autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
        // breakpoints={{
        //   640: {
        //     slidesPerView: 1,
        //     spaceBetween: 20,
        //   },
        //   768: {
        //     slidesPerView: 1,
        //     spaceBetween: 40,
        //   },
        //   1024: {
        //     slidesPerView: 1,
        //     spaceBetween: 50,
        //   },
        // }}
        style={{ maxWidth: "320px", height: "240px" }} 
        // spaceBetween={50}
        // slidesPerView={1}
        // onSlideChange={() => console.log("slide change")}
        // onSwiper={(swiper) => console.log(swiper)}
      >
        {DATA.languages.map((lang, id) => {
          return (
            <BlurFade delay={BLUR_FADE_DELAY * props.blur_delay * id} key={id}>
              <SwiperSlide
                style={{
                  display: "flex",
                  flexDirection: "row",
                  borderRadius: "18px",
                  fontSize: "22px",
                  fontWeight: "bold",
                  maxWidth: "320px",
                }}
              >
                <img
                  alt={lang.name + lang.level}
                  key={lang.name + id}
                  src={lang.url}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div
                  id="transparent-layer"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    padding: "1rem",
                    width: "100%",
                    height: "100%",
                    background:
                      "linear-gradient(to right, rgba(0, 0, 0, 0.1) 5%, transparent, transparent)",
                    position: "absolute",
                    color: "white",
                  }}
                >
                  <div>
                    <span
                      className="font-bold text-sm p-2 "
                      style={{
                        color: "white",
                        background: "black",
                        borderRadius: "10px",
                        display:'flex',
                        flexDirection:'column',
                        alignItems:'flex-start',
                      }}
                    >
                      {lang.name}
                      <span className="text-xs font-normal">{lang.level}</span>
                    </span>
                  </div>
                </div>
              </SwiperSlide>
            </BlurFade>
          );
        })}
      </Swiper>
    </BlurFade>
  );
};
