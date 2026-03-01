import { motion, useScroll, useTransform } from 'motion/react';
import { useRef, CSSProperties } from 'react';

interface ParallaxBackgroundProps {
  imageSrc: string;
  speed?: number;
  className?: string;
}

export function ParallaxBackground({ 
  imageSrc, 
  speed = 0.5,
  className = '' 
}: ParallaxBackgroundProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  
  // Transform scroll position to Y offset
  // Negative value moves the image up as we scroll down
  const y = useTransform(scrollY, [0, 1000], [0, 1000 * speed]);

  return (
    <div ref={ref} className={`absolute inset-0 overflow-hidden ${className}`}>
      <motion.div
        style={{
          y,
          backgroundImage: `url(${imageSrc})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'absolute',
          top: '-20%',
          left: 0,
          right: 0,
          bottom: '-20%',
          height: '140%',
        }}
      />
    </div>
  );
}
