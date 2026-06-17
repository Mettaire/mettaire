import { motion } from 'framer-motion';

/**
 * Wraps content so it fades/rises into view once as the user scrolls to it.
 * Usage: <Reveal className="my-section">...</Reveal>
 *   - as: which element to render (default 'div')
 *   - delay: stagger in seconds
 *   - y: starting offset in px
 */
const Reveal = ({ children, as = 'div', className = '', delay = 0, y = 48, ...rest }) => {
  const MotionTag = motion[as] || motion.div;
  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      // Longer travel + expo ease-out = the smooth Apple-style settle
      transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1], delay }}
      {...rest}
    >
      {children}
    </MotionTag>
  );
};

export default Reveal;
