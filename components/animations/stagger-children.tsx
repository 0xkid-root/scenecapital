"use client";

import React from 'react';
import { useEffect, useRef } from "react";
import { useInView, useAnimation, motion } from "framer-motion";

type StaggerChildrenProps = {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  duration?: number;
  threshold?: number;
  delayStart?: number;
  once?: boolean;
};

export function StaggerChildren({
  children,
  className = "",
  staggerDelay = 0.1,
  duration = 0.5,
  threshold = 0.1,
  delayStart = 0,
  once = true,
}: StaggerChildrenProps) {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { 
    threshold,
    once,
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: delayStart,
        staggerChildren: staggerDelay,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: duration,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={containerVariants}
      className={className}
    >
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        
        return (
          <motion.div variants={itemVariants}>
            {child}
          </motion.div>
        );
      })}
    </motion.div>
  );
}