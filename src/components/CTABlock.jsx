import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './CTABlock.css';

export default function CTABlock() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const floats = el.querySelectorAll('.ctablock__float');
      floats.forEach((f, i) => {
        gsap.fromTo(f,
          { y: 80, opacity: 0 },
          {
            y: -30,
            opacity: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top 90%',
              end: 'bottom 20%',
              scrub: 0.8,
            },
            delay: i * 0.1,
          }
        );
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="ctablock">
      <div className="container ctablock__inner">
        <img className="ctablock__float ctablock__float--1" src="/images/cta-1.jpg" alt="" aria-hidden loading="lazy" decoding="async" />
        <img className="ctablock__float ctablock__float--2" src="/images/cta-2.jpg" alt="" aria-hidden loading="lazy" decoding="async" />
        <img className="ctablock__float ctablock__float--3" src="/images/cta-3.jpg" alt="" aria-hidden loading="lazy" decoding="async" />

        <h2 className="display ctablock__title">
          Live different.<br/>Live better.
        </h2>

        <a href="#contact" className="cta ctablock__cta">Book a Site Visit</a>

        <div className="ctablock__signature">
          <div className="ctablock__avatars" aria-hidden>
            <span /><span />
          </div>
          <span>We'd love to talk.</span>
        </div>
      </div>
    </section>
  );
}
