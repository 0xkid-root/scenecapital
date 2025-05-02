"use client";

import { useEffect, useRef } from "react";
import { useInView, useAnimation, motion } from "framer-motion";

type FadeInProps = {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right" | "none";
  duration?: number;
  delay?: number;
  className?: string;
  threshold?: number;
  once?: boolean;
};

export function FadeIn({
  children,
  direction = "up",
  duration = 0.5,
  delay = 0,
  className = "",
  threshold = 0.1,
  once = true,
}: FadeInProps) {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { 
    amount: 0.5, 
    once,
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const getDirectionVariants = () => {
    switch (direction) {
      case "up":
        return { y: 40 };
      case "down":
        return { y: -40 };
      case "left":
        return { x: 40 };
      case "right":
        return { x: -40 };
      default:
        return { opacity: 0 };
    }
  };

  const variants = {
    hidden: {
      opacity: 0,
      ...getDirectionVariants(),
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}