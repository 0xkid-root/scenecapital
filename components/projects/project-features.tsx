'use client';

import { FC } from 'react';
import { motion } from 'framer-motion';

interface ProjectFeaturesProps {
  features: string[];
}

const ProjectFeatures: FC<ProjectFeaturesProps> = ({ features }) => {
  return (
    <div className='grid grid-cols-2 gap-4 mt-6'>
      {features.map((feature, index) => (
        <motion.div
          key={feature}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 + index * 0.1 }}
          className='flex items-center space-x-2'
        >
          <div className='h-2 w-2 rounded-full bg-primary' />
          <span className='text-sm'>{feature}</span>
        </motion.div>
      ))}
    </div>
  );
};

export { ProjectFeatures };
export default ProjectFeatures;
