import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import Reveal from './Reveal';
import './Testimonials.css';

const testimonials = [
  {
    quote: "What I liked most about Icon Realty was the transparency. Every promise made during booking was fulfilled exactly as explained — from plot sizes to timelines. It's rare to find such professionalism in today's real estate market.",
    name: 'Amit Sharma',
    role: 'Oscar Fort Homebuyer',
  },
  {
    quote: 'We were looking for a peaceful yet well-connected neighborhood, and Siddhayatan turned out to be the perfect choice. The location, planning, and open spaces make it feel like a community rather than just a project.',
    name: 'Neha & Rakesh Gupta',
    role: 'Siddhayatan Residents',
  },
  {
    quote: "Icon Realty's attention to detail is remarkable. From wide internal roads to green spaces, everything at Oscar Palace feels thoughtfully designed. It truly gives a sense of royal living.",
    name: 'Vivek Khanna',
    role: 'Oscar Palace Investor',
  },
  {
    quote: 'Saatvik Vihar stood out because it delivered exactly what it promised — affordable, quality homes without cutting corners. The entire process, from site visit to handover, was smooth and transparent.',
    name: 'Priya Jain',
    role: 'Saatvik Vihar Homeowner',
  },
  {
    quote: 'Buying a plot at Eden Garden was one of the best decisions we made. The environment is calm, green, and perfect for raising a family. You can really feel the planning and passion behind the project.',
    name: 'Ankit & Ritu Verma',
    role: 'Eden Garden Plot Owners',
  },
  {
    quote: "What impressed me was Icon Realty's commitment to long-term relationships. Even after the sale, the team was approachable and supportive with documentation and development updates.",
    name: 'Manoj Patel',
    role: 'Icon Realty Investor',
  },
];

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const cardsRef = useRef(null);

  const go = (dir) => setActive((p) => (p + dir + testimonials.length) % testimonials.length);

  useEffect(() => {
    const els = cardsRef.current?.querySelectorAll('.testimonial');
    if (!els) return;
    els.forEach((el, i) => {
      const offset = i - active;
      gsap.to(el, {
        // xPercent, not x: '110%'. GSAP resolves a percentage `x` to pixels at
        // tween time, so after a viewport resize (or a phone rotating) every
        // card sat at an offset computed for the old card width — which pushed
        // the off-screen cards further out than the clip and left the document
        // reporting a wider scroll width than the viewport.
        xPercent: offset * 110,
        scale: i === active ? 1 : 0.92,
        opacity: i === active ? 1 : 0.35,
        duration: 0.9,
        ease: 'expo.out',
      });
    });
  }, [active]);

  return (
    <section className="testimonials" id="testimonials">
      <div className="testimonials__shell">
        <div className="container testimonials__head">
          <Reveal as="span" className="eyebrow testimonials__eyebrow">What our families say</Reveal>
          <Reveal as="h2" className="display testimonials__title" delay={0.05}>
            Trust, in their<br/>own words.
          </Reveal>
        </div>

        <div className="testimonials__viewport">
          <div ref={cardsRef} className="testimonials__track">
            {testimonials.map((t, i) => (
              <article key={i} className="testimonial">
                <svg className="testimonial__mark" width="56" height="48" viewBox="0 0 56 48" fill="none" aria-hidden>
                  <path d="M0 28C0 14 8 4 22 0L24 8C16 12 12 18 12 26H22V48H0V28ZM34 28C34 14 42 4 56 0L58 8C50 12 46 18 46 26H56V48H34V28Z" fill="currentColor"/>
                </svg>
                <p className="testimonial__quote">"{t.quote}"</p>
                <div className="testimonial__byline">
                  <span className="testimonial__name">{t.name}</span>
                  <span className="testimonial__role">{t.role}</span>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="container testimonials__controls">
          <div className="testimonials__counter">
            <span className="is-current">{String(active + 1).padStart(2, '0')}</span>
            <span className="testimonials__counter-sep" />
            <span>{String(testimonials.length).padStart(2, '0')}</span>
          </div>
          <div className="testimonials__buttons">
            <button onClick={() => go(-1)} aria-label="Previous testimonial">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M12 4L6 10L12 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="is-primary" onClick={() => go(1)} aria-label="Next testimonial">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M8 4L14 10L8 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
