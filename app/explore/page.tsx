import { ProjectGrid } from '@/components/projects/project-grid';
import { ProjectFilters } from '@/components/projects/project-filters';
import { PageHeader } from '@/components/ui/page-header';

export default function ExplorePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Explore Projects"
        description="Discover and invest in curated real estate opportunities"
      />
      <ProjectFilters />
      <ProjectGrid />
    </div>
  );
}
