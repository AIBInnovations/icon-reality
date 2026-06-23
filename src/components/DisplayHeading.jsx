import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Reveal from './Reveal';
import './DisplayHeading.css';

const TRAIL_IMAGES = [
  '/images/oscar/entrance/entrance-1.jpg',
  '/images/oscar/temple/temple-1.jpg',
  '/images/oscar/park/park-1.jpg',
  '/images/oscar/photos/photo-1.jpg',
  '/images/oscar/entrance/entrance-2.jpg',
  '/images/oscar/amenities/amenity-1.jpg',
  '/images/oscar/photos/photo-8.jpg',
  '/images/oscar/park/park-7.jpg',
  '/images/oscar/photos/photo-4.jpg',
  '/images/oscar/entrance/entrance-3.jpg',
];

const SPAWN_DISTANCE = 90; // px of mouse movement before spawning next image

export default function DisplayHeading() {
  const sectionRef = useRef(null);
  const trailRefs = useRef([]);
  const trailIdxRef = useRef(0);
  const lastPosRef = useRef({ x: 0, y: 0 });
  const insideRef = useRef(false);
  const lineRefs = useRef([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Skip the hover trail on touch devices AND narrow viewports — mobile
    // uses a static scattered photo collage controlled by CSS instead.
    const isCoarse = window.matchMedia('(pointer: coarse)').matches;
    const isNarrow = window.matchMedia('(max-width: 720px)').matches;
    if (isCoarse || isNarrow) return;

    let zCounter = 1;

    const spawn = (x, y) => {
      const img = trailRefs.current[trailIdxRef.current];
      if (!img) return;
      trailIdxRef.current = (trailIdxRef.current + 1) % trailRefs.current.length;

      const rot = (Math.random() - 0.5) * 14;
      const offX = (Math.random() - 0.5) * 40;
      const offY = (Math.random() - 0.5) * 30;

      gsap.killTweensOf(img);
      gsap.set(img, {
        x: x + offX,
        y: y + offY,
        xPercent: -50,
        yPercent: -50,
        rotation: rot,
        scale: 0.85,
        opacity: 0,
        zIndex: zCounter++,
      });

      gsap.timeline()
        .to(img, { opacity: 1, scale: 1, duration: 0.18, ease: 'power2.out' })
        .to(img, { scale: 0.3, opacity: 0, duration: 0.32, ease: 'power2.in' }, '+=0.4');
    };

    // first time the pointer enters the section → immediately spawn a card
    // at the cursor so the user sees the feature exists.
    const onEnter = (e) => {
      insideRef.current = true;
      const rect = section.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      spawn(x, y);
      lastPosRef.current = { x, y };
    };

    const onLeave = () => {
      insideRef.current = false;
    };

    const onMove = (e) => {
      const rect = section.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const dx = x - lastPosRef.current.x;
      const dy = y - lastPosRef.current.y;
      const dist = Math.hypot(dx, dy);

      if (dist > SPAWN_DISTANCE) {
        spawn(x, y);
        lastPosRef.current = { x, y };
      }
    };

    section.addEventListener('mouseenter', onEnter);
    section.addEventListener('mouseleave', onLeave);
    section.addEventListener('mousemove', onMove);

    return () => {
      section.removeEventListener('mouseenter', onEnter);
      section.removeEventListener('mouseleave', onLeave);
      section.removeEventListener('mousemove', onMove);
    };
  }, []);

  useEffect(() => {
    const lines = lineRefs.current.filter(Boolean);
    if (!lines.length || !sectionRef.current) return;
    gsap.set(lines, { yPercent: 110 });
    const tween = gsap.to(lines, {
      yPercent: 0,
      duration: 1.1,
      ease: 'power3.out',
      stagger: 0.14,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 75%',
        toggleActions: 'play none none none',
      },
    });
    return () => {
      tween.scrollTrigger && tween.scrollTrigger.kill();
      tween.kill();
    };
  }, []);

  return (
    <section ref={sectionRef} className="display-section" id="project">
      <div className="display-section__pool" aria-hidden>
        {TRAIL_IMAGES.map((src, i) => (
          <img
            key={src}
            ref={(el) => (trailRefs.current[i] = el)}
            src={src}
            alt=""
            className="display-section__trail-img"
          />
        ))}
      </div>

      <div className="container display-section__inner">
        <h2 className="display display-section__heading">
          <span className="display-section__line">
            <span className="display-section__line-inner" ref={(el) => (lineRefs.current[0] = el)}>
              Premium plots
            </span>
          </span>
          <span className="display-section__line">
            <span className="display-section__line-inner" ref={(el) => (lineRefs.current[1] = el)}>
              for refined living.
            </span>
          </span>
        </h2>
        <Reveal as="p" className="display-section__lede" delay={0.05}>
          Oscar Palace is drawn from the grammar of Indian heritage — the symmetry of royal
          courtyards, the rhythm of carved arches, and the quiet grandeur once reserved for kings
          and empires. Every baradari, chhatri, and tree-lined axis is composed so your address
          carries the dignity of a palace with the ease of a modern home.
        </Reveal>
      </div>

    </section>
  );
}
