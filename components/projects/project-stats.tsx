'use client';

import { FC } from 'react';
import { Users, TrendingUp, Calendar, DollarSign } from 'lucide-react';

interface ProjectStatsProps {
  investors: number;
  returns: number;
  timeline: string;
  minInvestment?: number;
}

const ProjectStats: FC<ProjectStatsProps> = ({
  investors,
  returns,
  timeline,
  minInvestment = 100
}) => {
  return (
    <div className='grid grid-cols-2 gap-4'>
      <div className='space-y-1'>
        <div className='flex items-center text-sm text-muted-foreground'>
          <Users className='h-4 w-4 mr-1' />
          <span>Investors</span>
        </div>
        <p className='font-medium'>{investors}</p>
      </div>
      <div className='space-y-1'>
        <div className='flex items-center text-sm text-muted-foreground'>
          <TrendingUp className='h-4 w-4 mr-1' />
          <span>Returns</span>
        </div>
        <p className='font-medium text-green-600'>+{returns}%</p>
      </div>
      <div className='space-y-1'>
        <div className='flex items-center text-sm text-muted-foreground'>
          <Calendar className='h-4 w-4 mr-1' />
          <span>Timeline</span>
        </div>
        <p className='font-medium'>{timeline}</p>
      </div>
      <div className='space-y-1'>
        <div className='flex items-center text-sm text-muted-foreground'>
          <DollarSign className='h-4 w-4 mr-1' />
          <span>Min. Investment</span>
        </div>
        <p className='font-medium'>${minInvestment}</p>
      </div>
    </div>
  );
};

export { ProjectStats };
export default ProjectStats;
