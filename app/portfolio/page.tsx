import { PortfolioOverview } from '@/components/portfolio/portfolio-overview';
import { PortfolioStats } from '@/components/portfolio/portfolio-stats';
import { InvestmentsList } from '@/components/portfolio/investments-list';
import { PageHeader } from '@/components/ui/page-header';

export default function PortfolioPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="My Portfolio"
        description="Track and manage your investment portfolio"
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <PortfolioStats />
      </div>
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <PortfolioOverview />
        </div>
        <div className="lg:col-span-4">
          <InvestmentsList />
        </div>
      </div>
    </div>
  );
}
