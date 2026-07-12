import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const STEPS = [
  {
    id: 'type',
    number: '01',
    title: 'Type your passion',
    description: 'Football, open source, cooking — anything you care about.',
    image: '/workflow/step-1-landing.png',
  },
  {
    id: 'vessel',
    number: '02',
    title: 'Choose your vessel',
    description: 'Age it in wine for devotion, or forge it in fire for intensity.',
    image: '/workflow/step-2-loading.png',
  },
  {
    id: 'artifact',
    number: '03',
    title: 'Receive your artifact',
    description: 'A unique label or forge mark — narrated, downloadable, shareable.',
    image: '/workflow/step-3-result.png',
  },
];

function WorkflowShowcase({ accentColor, parchment, reducedMotion = false }) {
  const [active, setActive] = useState(0);
  const imageRefs = useRef([]);

  useEffect(() => {
    if (reducedMotion) return undefined;
    const timer = setInterval(() => {
      setActive((i) => (i + 1) % STEPS.length);
    }, 3200);
    return () => clearInterval(timer);
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return;
    imageRefs.current.forEach((el, index) => {
      if (!el) return;
      gsap.to(el, {
        opacity: index === active ? 1 : 0,
        scale: index === active ? 1 : 1.04,
        duration: 0.75,
        ease: 'power2.inOut',
      });
    });
  }, [active, reducedMotion]);

  return (
    <section className="workflow-showcase" aria-label="How Passion Uncorked works">
      <p
        className="workflow-showcase-eyebrow"
        style={{ color: parchment, borderColor: `${accentColor}55` }}
      >
        How it works
      </p>

      <div className="workflow-showcase-stage">
        {STEPS.map((step, index) => (
          <img
            key={step.id}
            ref={(el) => { imageRefs.current[index] = el; }}
            src={step.image}
            alt={`${step.title} — ${step.description}`}
            className="workflow-showcase-image"
            style={{ opacity: index === 0 ? 1 : 0 }}
            loading={index === 0 ? 'eager' : 'lazy'}
          />
        ))}
        <div className="workflow-showcase-scanline" style={{ borderColor: `${accentColor}33` }} />
      </div>

      <div className="workflow-showcase-steps">
        {STEPS.map((step, index) => (
          <button
            key={step.id}
            type="button"
            className={`workflow-step ${index === active ? 'is-active' : ''}`}
            onClick={() => setActive(index)}
            aria-pressed={index === active}
            style={{
              borderColor: index === active ? accentColor : `${accentColor}33`,
              color: parchment,
            }}
          >
            <span className="workflow-step-number" style={{ color: accentColor }}>
              {step.number}
            </span>
            <span className="workflow-step-title">{step.title}</span>
            <span className="workflow-step-desc">{step.description}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

export default WorkflowShowcase;
