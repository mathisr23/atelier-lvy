import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const variants = {
  up:    { hidden: { opacity: 0, y: 40 },  visible: { opacity: 1, y: 0 } },
  down:  { hidden: { opacity: 0, y: -30 }, visible: { opacity: 1, y: 0 } },
  left:  { hidden: { opacity: 0, x: 40 },  visible: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0 } },
  fade:  { hidden: { opacity: 0 },          visible: { opacity: 1 } },
  scale: { hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } },
}

export default function Reveal({
  children,
  delay = 0,
  direction = 'up',
  className = '',
  as = 'div',
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })

  const MotionTag = motion[as] || motion.div

  return (
    <MotionTag
      ref={ref}
      variants={variants[direction]}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </MotionTag>
  )
}
