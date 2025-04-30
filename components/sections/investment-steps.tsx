import { motion } from 'framer-motion';
import { UserPlus, Search, FileCheck, CreditCard, TrendingUp } from 'lucide-react';

const steps = [
  {
    icon: <UserPlus className="w-6 h-6" />,
    title: "Create an Account",
    description: "Sign up in minutes with our secure and streamlined verification process."
  },
  {
    icon: <Search className="w-6 h-6" />,
    title: "Discover Projects",
    description: "Browse our curated selection of high-potential creative ventures."
  },
  {
    icon: <FileCheck className="w-6 h-6" />,
    title: "Due Diligence",
    description: "Review detailed project documentation, team credentials, and financial projections."
  },
  {
    icon: <CreditCard className="w-6 h-6" />,
    title: "Make Investment",
    description: "Invest any amount and receive tokens representing your ownership share."
  },
  {
    icon: <TrendingUp className="w-6 h-6" />,
    title: "Track & Earn",
    description: "Monitor project progress and receive automatic returns when milestones are reached."
  }
];

export function InvestmentSteps() {
  return (
    <section className="py-24 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">How to start investing</h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Our streamlined process makes investing in creative projects as simple as possible.
            Follow these steps to begin your journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative group"
            >
              <div className="flex flex-col items-center text-center p-6 rounded-xl bg-white dark:bg-slate-800 hover:glow-effect transition-all">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4 group-hover:glow-effect">
                  {step.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {step.description}
                </p>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute -right-4 top-1/2 transform -translate-y-1/2 z-10">
                    <div className="w-8 h-0.5 bg-blue-200 dark:bg-blue-800 group-hover:glow-effect" />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}