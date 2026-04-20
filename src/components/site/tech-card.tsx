"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type TechCardProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export function TechCard({ children, className, delay = 0 }: TechCardProps) {
  return (
    <motion.article
      className={`tech-panel rounded-[10px] p-4 backdrop-blur sm:p-5 md:p-6 ${className ?? ""}`}
      initial={{ opacity: 0, y: 18, scale: 0.992 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ y: -4, scale: 1.008 }}
      viewport={{ once: true, margin: "-10% 0px -8% 0px" }}
      transition={{ duration: 0.42, delay, ease: [0.22, 0.7, 0.18, 1] }}
    >
      {children}
    </motion.article>
  );
}
