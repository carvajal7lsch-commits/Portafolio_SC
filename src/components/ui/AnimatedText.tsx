import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export const AnimatedText = ({ text, className = "" }: { text: string; className?: string }) => {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.8', 'end 0.2']
  });

  const characters = text.split('');

  return (
    <p ref={containerRef} className={className}>
      {characters.map((char, i) => {
        const start = i / characters.length;
        const end = start + (1 / characters.length);
        const opacity = useTransform(scrollYProgress, [start, end], [0.2, 1]);

        return (
          <span key={i} className="relative inline-block">
            {/* Invisible placeholder to maintain layout */}
            <span className="invisible">{char}</span>
            {/* Absolute animated character */}
            <motion.span
              style={{ opacity }}
              className="absolute left-0 top-0"
            >
              {char}
            </motion.span>
          </span>
        );
      })}
    </p>
  );
};
