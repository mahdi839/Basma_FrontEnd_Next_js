import Image from "next/image";

export default function Hero() {
  return (
    <section className="container hero_banner" aria-label="Eyara Fashion">
      <Image
        className="hero_banner_img"
        src="/img/hero_banners/eyara-fashion-hero.jpeg"
        width={1600}
        height={650}
        alt="Eyara Fashion premium shoes, bags, and accessories"
        sizes="(max-width: 1199px) calc(100vw - 24px), 1140px"
        priority
      />
    </section>
  );
}
