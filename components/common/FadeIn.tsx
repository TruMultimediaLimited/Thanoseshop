"use client";

import { motion } from "framer-motion";

/**
 * Fast, subtle fade-and-rise on first scroll into view. Deliberately the
 * only scroll animation in the design system — sections opt in by wrapping,
 * nothing else animates on scroll (design spec: "do not over animate").
 */
export function FadeIn({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.28, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
