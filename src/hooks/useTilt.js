import { useRef } from 'react';

// Plain pointer-driven 3D tilt — no animation library. Returns a ref to
// attach to the tilt container plus mouse handlers.
export function useTilt({ max = 10, disabled = false } = {}) {
  const ref = useRef(null);

  function handleMouseMove(e) {
    if (disabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    ref.current.style.transform =
      `perspective(800px) rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg)`;
  }

  function handleMouseLeave() {
    if (!ref.current) return;
    ref.current.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg)';
  }

  return { ref, handleMouseMove, handleMouseLeave };
}
