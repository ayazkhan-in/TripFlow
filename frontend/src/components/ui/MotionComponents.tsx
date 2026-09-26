import React from 'react';
import { motion, HTMLMotionProps, Variants } from 'framer-motion';

/**
 * WordByWordBlurText
 * Renders text with a word-by-word appear animation accompanied by a Gaussian blur effect.
 */
interface WordByWordBlurTextProps {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  staggerDuration?: number;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
}

export const WordByWordBlurText: React.FC<WordByWordBlurTextProps> = ({
  text,
  className = '',
  wordClassName = '',
  delay = 0.1,
  staggerDuration = 0.07,
  as: Component = 'div',
}) => {
  const words = text.split(/\s+/).filter(Boolean);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDuration,
        delayChildren: delay,
      },
    },
  };

  const wordVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 18,
      filter: 'blur(10px)',
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: {
        duration: 0.55,
        ease: [0.2, 0.65, 0.3, 0.9],
      },
    },
  };

  const MotionComponent = motion[Component] as any;

  return (
    <MotionComponent
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          variants={wordVariants}
          className={`inline-block mr-[0.28em] will-change-transform ${wordClassName}`}
        >
          {word}
        </motion.span>
      ))}
    </MotionComponent>
  );
};

/**
 * BlurFadeCard
 * Wraps any card in the website to provide a staggered appear animation with blur and translation.
 */
interface BlurFadeCardProps extends HTMLMotionProps<'div'> {
  index?: number;
  delay?: number;
  duration?: number;
  yOffset?: number;
  blurAmount?: number;
  hoverEffect?: boolean;
}

export const BlurFadeCard: React.FC<BlurFadeCardProps> = ({
  children,
  index = 0,
  delay,
  duration = 0.5,
  yOffset = 20,
  blurAmount = 10,
  hoverEffect = false,
  className = '',
  ...props
}) => {
  const calculatedDelay = delay !== undefined ? delay : index * 0.08;

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: yOffset,
        filter: `blur(${blurAmount}px)`,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
      }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{
        duration,
        delay: calculatedDelay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      whileHover={
        hoverEffect
          ? {
              y: -4,
              transition: { duration: 0.2, ease: 'easeOut' },
            }
          : undefined
      }
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

/**
 * StaggerContainer
 * Container for staggering children animations
 */
export const StaggerContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
  stagger?: number;
}> = ({ children, className = '', delay = 0, stagger = 0.08 }) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-20px' }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: stagger,
            delayChildren: delay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * StaggerItem
 * Child item inside a StaggerContainer
 */
export const StaggerItem: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 16, filter: 'blur(8px)' },
        visible: {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          transition: { duration: 0.5, ease: [0.2, 0.65, 0.3, 0.9] },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * PageTransition
 * Wraps page-level components for smooth route and tab transitions
 */
export const PageTransition: React.FC<{
  children: React.ReactNode;
  className?: string;
  transitionKey?: string;
}> = ({ children, className = '', transitionKey }) => {
  return (
    <motion.div
      key={transitionKey}
      initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={`w-full ${className}`}
    >
      {children}
    </motion.div>
  );
};
