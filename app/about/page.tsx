'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  FileSignature, 
  Shield, 
  Zap, 
  Globe, 
  Users, 
  Layers, 
  Lightbulb,
  ChevronRight,
  ExternalLink,
  Github,
  Linkedin,
  Twitter
} from 'lucide-react';

// Sample team data
const teamMembers = [
  {
    name: 'Elena Rodriguez',
    role: 'CEO & Founder',
    bio: 'Former film producer with 15+ years in the entertainment industry. Passionate about democratizing IP ownership and creating new opportunities for creators.',
    avatar: '/avatars/elena-rodriguez.jpg',
    social: {
      linkedin: 'https://linkedin.com/in/elena-rodriguez',
      twitter: 'https://twitter.com/elenarod'
    }
  },
  {
    name: 'Marcus Chen',
    role: 'CTO',
    bio: 'Blockchain architect with experience at major Web3 companies. Led development of several successful DeFi and NFT platforms.',
    avatar: '/avatars/marcus-chen.jpg',
    social: {
      linkedin: 'https://linkedin.com/in/marcus-chen',
      github: 'https://github.com/marcuschen',
      twitter: 'https://twitter.com/marcuschen'
    }
  },
  {
    name: 'Amara Johnson',
    role: 'Chief Legal Officer',
    bio: 'IP attorney with expertise in entertainment law and blockchain technology. Previously advised major studios on digital rights management.',
    avatar: '/avatars/amara-johnson.jpg',
    social: {
      linkedin: 'https://linkedin.com/in/amara-johnson'
    }
  },
  {
    name: 'Kai Nakamura',
    role: 'Head of Partnerships',
    bio: 'Former studio executive with extensive network in film, TV, and streaming platforms. Passionate about connecting creators with new distribution channels.',
    avatar: '/avatars/kai-nakamura.jpg',
    social: {
      linkedin: 'https://linkedin.com/in/kai-nakamura',
      twitter: 'https://twitter.com/kainakamura'
    }
  },
  {
    name: 'Sophia Williams',
    role: 'Head of Creator Relations',
    bio: 'Former talent agent who has worked with top creators across film, music, and publishing. Focused on helping creators maximize the value of their IP.',
    avatar: '/avatars/sophia-williams.jpg',
    social: {
      linkedin: 'https://linkedin.com/in/sophia-williams',
      twitter: 'https://twitter.com/sophiawilliams'
    }
  },
  {
    name: 'David Chen',
    role: 'Lead Blockchain Engineer',
    bio: 'Smart contract specialist with experience building tokenization platforms. Passionate about creating secure and efficient blockchain systems.',
    avatar: '/avatars/david-chen.jpg',
    social: {
      github: 'https://github.com/davidchen',
      linkedin: 'https://linkedin.com/in/david-chen'
    }
  }
];

// Sample advisors data
const advisors = [
  {
    name: 'Michael Torres',
    role: 'Legal Advisor',
    organization: 'Torres & Associates',
    avatar: '/avatars/michael-torres.jpg'
  },
  {
    name: 'Sarah Johnson',
    role: 'Entertainment Industry Advisor',
    organization: 'Global Studios',
    avatar: '/avatars/sarah-johnson.jpg'
  },
  {
    name: 'James Wilson',
    role: 'Blockchain Advisor',
    organization: 'Ethereum Foundation',
    avatar: '/avatars/james-wilson.jpg'
  }
];

// Sample investors data
const investors = [
  {
    name: 'Blockchain Ventures',
    logo: '/logos/blockchain-ventures.svg'
  },
  {
    name: 'Creative Capital',
    logo: '/logos/creative-capital.svg'
  },
  {
    name: 'Digital Entertainment Fund',
    logo: '/logos/digital-entertainment-fund.svg'
  },
  {
    name: 'Web3 Accelerator',
    logo: '/logos/web3-accelerator.svg'
  }
];

export default function AboutPage() {
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <div className="container mx-auto px-4 py-8 relative overflow-hidden">
      {/* Background gradient elements */}
      <div className="absolute -top-48 -right-48 w-96 h-96 bg-primary/5 rounded-full filter blur-3xl opacity-30 animate-pulse-slow" />
      <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-secondary/5 rounded-full filter blur-3xl opacity-30 animate-pulse-slow" />
      
      <motion.div
        initial="hidden"
        animate="show"
        variants={container}
        className="space-y-16"
      >
        {/* Hero Section */}
        <motion.section variants={item} className="text-center space-y-6 py-12">
          <Badge className="px-4 py-1 text-base bg-primary/10 text-primary border-0 mb-4">About Scene Capital</Badge>
          <h1 className="text-4xl md:text-5xl font-bold max-w-3xl mx-auto">
            Revolutionizing IP Ownership Through Decentralization
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We're building the future of intellectual property licensing and ownership, empowering creators and fans through blockchain technology.
          </p>
        </motion.section>

        {/* Mission Section */}
        <motion.section variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <Badge className="bg-secondary/10 text-secondary border-0">Our Mission</Badge>
            <h2 className="text-3xl font-bold">Democratizing IP Ownership</h2>
            <p className="text-lg text-muted-foreground">
              Scene Capital was founded with a clear mission: to transform how intellectual property is owned, monetized, and licensed in the creative industries. We believe that creators should have more control over their work, and that fans should be able to participate in the success of the content they love.
            </p>
            <p className="text-lg text-muted-foreground">
              Through blockchain technology, we're creating a more transparent, efficient, and equitable ecosystem for IP management, enabling fractional ownership, automated royalties, and new forms of collaboration between creators and their communities.
            </p>
            <div className="pt-4">
              <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90">
                Learn How It Works
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-video rounded-xl overflow-hidden shadow-2xl">
              <img 
                src="/images/about/mission-image.jpg" 
                alt="Scene Capital platform in action" 
                className="w-full h-full object-cover"
              />
            </div>
            {/* Floating stats cards */}
            <div className="absolute -bottom-6 -left-6 bg-card/80 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-border/50">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <FileSignature className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Projects Tokenized</p>
                  <p className="text-2xl font-bold">250+</p>
                </div>
              </div>
            </div>
            <div className="absolute -top-6 -right-6 bg-card/80 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-border/50">
              <div className="flex items-center gap-3">
                <div className="bg-secondary/10 p-2 rounded-full">
                  <Users className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Active Users</p>
                  <p className="text-2xl font-bold">10k+</p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Values Section */}
        <motion.section variants={item} className="space-y-8">
          <div className="text-center space-y-3">
            <Badge className="bg-accent/10 text-accent border-0">Our Values</Badge>
            <h2 className="text-3xl font-bold">Principles That Guide Us</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              At Scene Capital, our work is guided by a set of core values that inform every decision we make and product we build.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 border-border/50 hover:shadow-md transition-shadow">
              <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Creator First</h3>
              <p className="text-muted-foreground">
                We prioritize creators' rights and interests, ensuring they maintain control over their intellectual property.
              </p>
            </Card>
            
            <Card className="p-6 border-border/50 hover:shadow-md transition-shadow">
              <div className="bg-secondary/10 p-3 rounded-full w-fit mb-4">
                <Zap className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Innovation</h3>
              <p className="text-muted-foreground">
                We constantly push the boundaries of what's possible with blockchain technology and IP management.
              </p>
            </Card>
            
            <Card className="p-6 border-border/50 hover:shadow-md transition-shadow">
              <div className="bg-accent/10 p-3 rounded-full w-fit mb-4">
                <Globe className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-2">Accessibility</h3>
              <p className="text-muted-foreground">
                We're committed to making IP investment and licensing accessible to everyone, regardless of background.
              </p>
            </Card>
            
            <Card className="p-6 border-border/50 hover:shadow-md transition-shadow">
              <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">
                <Layers className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Transparency</h3>
              <p className="text-muted-foreground">
                We believe in full transparency in all aspects of our platform, from smart contracts to revenue distribution.
              </p>
            </Card>
          </div>
        </motion.section>

        {/* Team Section */}
        <motion.section variants={item} className="space-y-8">
          <div className="text-center space-y-3">
            <Badge className="bg-primary/10 text-primary border-0">Our Team</Badge>
            <h2 className="text-3xl font-bold">Meet the Visionaries</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our diverse team brings together expertise from entertainment, blockchain, law, and finance to create a revolutionary IP platform.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member, index) => (
              <Card key={index} className="overflow-hidden border-border/50 hover:shadow-md transition-shadow group">
                <div className="aspect-[3/2] relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                  <img 
                    src={member.avatar} 
                    alt={member.name} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-4 left-4 right-4 z-20">
                    <h3 className="text-xl font-bold text-white">{member.name}</h3>
                    <p className="text-white/80">{member.role}</p>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
                  <div className="flex gap-2 mt-4">
                    {member.social.linkedin && (
                      <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                        <Linkedin className="h-5 w-5" />
                      </a>
                    )}
                    {member.social.twitter && (
                      <a href={member.social.twitter} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                        <Twitter className="h-5 w-5" />
                      </a>
                    )}
                    {member.social.github && (
                      <a href={member.social.github} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                        <Github className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </motion.section>

        {/* Advisors Section */}
        <motion.section variants={item} className="space-y-8">
          <div className="text-center space-y-3">
            <Badge className="bg-secondary/10 text-secondary border-0">Our Advisors</Badge>
            <h2 className="text-3xl font-bold">Expert Guidance</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our advisors provide invaluable expertise and industry connections to help us navigate the complex worlds of entertainment and blockchain.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6">
            {advisors.map((advisor, index) => (
              <Card key={index} className="p-6 flex items-center gap-4 w-full md:w-auto border-border/50 hover:shadow-md transition-shadow">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={advisor.avatar} alt={advisor.name} />
                  <AvatarFallback>{advisor.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-bold">{advisor.name}</h3>
                  <p className="text-sm text-muted-foreground">{advisor.role}</p>
                  <p className="text-sm">{advisor.organization}</p>
                </div>
              </Card>
            ))}
          </div>
        </motion.section>

        {/* Investors Section */}
        <motion.section variants={item} className="space-y-8">
          <div className="text-center space-y-3">
            <Badge className="bg-accent/10 text-accent border-0">Our Backers</Badge>
            <h2 className="text-3xl font-bold">Backed by the Best</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We're proud to be supported by leading investors in blockchain, entertainment, and venture capital.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
            {investors.map((investor, index) => (
              <div key={index} className="h-16 flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity">
                <img 
                  src={investor.logo} 
                  alt={investor.name} 
                  className="max-h-full max-w-full"
                />
              </div>
            ))}
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section variants={item} className="text-center space-y-6 py-12">
          <Badge className="px-4 py-1 text-base bg-primary/10 text-primary border-0 mb-4">Join Our Journey</Badge>
          <h2 className="text-3xl md:text-4xl font-bold max-w-2xl mx-auto">
            Ready to Revolutionize IP Ownership with Us?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Whether you're a creator looking to tokenize your IP, an investor seeking new opportunities, or a fan wanting to support your favorite projects, Scene Capital has a place for you.
          </p>
          <div className="flex flex-wrap gap-4 justify-center pt-4">
            <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90">
              Get Started
            </Button>
            <Button size="lg" variant="outline">
              Contact Us
            </Button>
          </div>
        </motion.section>
      </motion.div>
    </div>
  );
}
