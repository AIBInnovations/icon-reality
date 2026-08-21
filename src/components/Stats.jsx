import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Reveal from './Reveal';
import './Stats.css';

const stats = [
  { value: 20, suffix: '+', label: 'Years of trust', sub: 'Building since 2004' },
  { value: 15, suffix: '+', label: 'Landmark projects', sub: 'Across Indore & beyond' },
  { value: 4500, suffix: '+', label: 'Happy families', sub: 'Welcomed home' },
  { value: 64, suffix: ' acres', label: 'Oscar Palace alone', sub: 'Designed by Ravi Gupta Ji' },
];

function formatNumber(n) {
  return n >= 1000 ? n.toLocaleString('en-IN') : String(n);
}

function Counter({ to, suffix }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obj = { v: 0 };
    const tween = gsap.to(obj, {
      v: to,
      duration: 1.8,
      ease: 'power2.out',
      onUpdate: () => { el.textContent = formatNumber(Math.round(obj.v)) + suffix; },
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
    });
    return () => {
      tween.scrollTrigger && tween.scrollTrigger.kill();
      tween.kill();
    };
  }, [to, suffix]);
  return <span ref={ref}>0{suffix}</span>;
}

export default function Stats() {
  return (
    <section className="stats" id="about">
      <div className="container stats__inner">
        <Reveal as="span" className="eyebrow stats__eyebrow">By the numbers</Reveal>
        <Reveal as="h2" className="display stats__heading" delay={0.05}>
          Two decades.<br/>One standard.
        </Reveal>
        <Reveal as="p" className="stats__lede" delay={0.1}>
          From the first plot to the latest landmark, Icon Realty has built a quiet reputation on transparency, craft, and a long view that puts families and investors first.
        </Reveal>

        <div className="stats__grid">
          {stats.map((s, i) => (
            <Reveal key={s.label} className="stats__card" delay={i * 0.08}>
              <span className="stats__value">
                <Counter to={s.value} suffix={s.suffix} />
              </span>
              <span className="stats__label">{s.label}</span>
              <span className="stats__sub">{s.sub}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
