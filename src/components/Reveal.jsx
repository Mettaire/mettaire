import { motion } from 'framer-motion';

/**
 * Wraps content so it fades/rises into view once as the user scrolls to it.
 * Usage: <Reveal className="my-section">...</Reveal>
 *   - as: which element to render (default 'div')
 *   - delay: stagger in seconds
 *   - y: starting offset in px
 */
const Reveal = ({ children, as = 'div', className = '', delay = 0, y = 28, ...rest }) => {
  const MotionTag = motion[as] || motion.div;
  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
      {...rest}
    >
      {children}
    </MotionTag>
  );
};

export default Reveal;
