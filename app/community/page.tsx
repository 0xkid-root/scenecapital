'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { 
  Search, 
  MessageSquare, 
  Users, 
  Heart, 
  MessageCircle, 
  Share2, 
  Film, 
  Music, 
  BookOpen, 
  Tv,
  Plus,
  Filter,
  ThumbsUp,
  Send
} from 'lucide-react';

// Sample community discussions data
const discussionTopics = [
  {
    id: 'topic-1',
    title: 'The Future of Tokenized Film Distribution',
    category: 'Film',
    author: {
      name: 'Elena Rodriguez',
      avatar: '/avatars/elena-rodriguez.jpg',
      role: 'Creator'
    },
    replies: 24,
    views: 156,
    likes: 42,
    lastActivity: '2 hours ago',
    pinned: true
  },
  {
    id: 'topic-2',
    title: 'Music Licensing in the Web3 Era: Opportunities and Challenges',
    category: 'Music',
    author: {
      name: 'Marcus Chen',
      avatar: '/avatars/marcus-chen.jpg',
      role: 'Creator'
    },
    replies: 18,
    views: 112,
    likes: 36,
    lastActivity: '5 hours ago',
    pinned: false
  },
  {
    id: 'topic-3',
    title: 'How Tokenization is Changing Book Publishing',
    category: 'Book',
    author: {
      name: 'Amara Johnson',
      avatar: '/avatars/amara-johnson.jpg',
      role: 'Creator'
    },
    replies: 15,
    views: 98,
    likes: 28,
    lastActivity: '1 day ago',
    pinned: false
  },
  {
    id: 'topic-4',
    title: 'Web Series Funding: Traditional vs. Tokenized Approaches',
    category: 'Web Series',
    author: {
      name: 'Kai Nakamura',
      avatar: '/avatars/kai-nakamura.jpg',
      role: 'Creator'
    },
    replies: 32,
    views: 187,
    likes: 54,
    lastActivity: '3 hours ago',
    pinned: false
  },
  {
    id: 'topic-5',
    title: 'Investor Spotlight: Success Stories in IP Investment',
    category: 'General',
    author: {
      name: 'Sarah Williams',
      avatar: '/avatars/sarah-williams.jpg',
      role: 'Investor'
    },
    replies: 27,
    views: 203,
    likes: 61,
    lastActivity: '6 hours ago',
    pinned: false
  },
  {
    id: 'topic-6',
    title: 'Legal Considerations for Fractional IP Ownership',
    category: 'Legal',
    author: {
      name: 'Michael Torres',
      avatar: '/avatars/michael-torres.jpg',
      role: 'Legal Advisor'
    },
    replies: 42,
    views: 256,
    likes: 73,
    lastActivity: '12 hours ago',
    pinned: true
  }
];

// Sample featured creators data
const featuredCreators = [
  {
    id: 'creator-1',
    name: 'Elena Rodriguez',
    avatar: '/avatars/elena-rodriguez.jpg',
    specialty: 'Film Director',
    projects: 3,
    followers: 1245,
    verified: true
  },
  {
    id: 'creator-2',
    name: 'Marcus Chen',
    avatar: '/avatars/marcus-chen.jpg',
    specialty: 'Music Producer',
    projects: 5,
    followers: 2356,
    verified: true
  },
  {
    id: 'creator-3',
    name: 'Amara Johnson',
    avatar: '/avatars/amara-johnson.jpg',
    specialty: 'Author',
    projects: 2,
    followers: 1876,
    verified: true
  },
  {
    id: 'creator-4',
    name: 'Kai Nakamura',
    avatar: '/avatars/kai-nakamura.jpg',
    specialty: 'Web Series Director',
    projects: 4,
    followers: 1543,
    verified: true
  }
];

// Helper function to get the appropriate icon for each category
const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Film':
      return <Film className="h-4 w-4" />;
    case 'Music':
      return <Music className="h-4 w-4" />;
    case 'Book':
      return <BookOpen className="h-4 w-4" />;
    case 'Web Series':
      return <Tv className="h-4 w-4" />;
    default:
      return <MessageSquare className="h-4 w-4" />;
  }
};

// Helper function to get the appropriate color class for each category
const getCategoryColorClass = (category: string) => {
  switch (category) {
    case 'Film':
      return 'bg-blue-500/10 text-blue-500';
    case 'Music':
      return 'bg-purple-500/10 text-purple-500';
    case 'Book':
      return 'bg-amber-500/10 text-amber-500';
    case 'Web Series':
      return 'bg-emerald-500/10 text-emerald-500';
    case 'Legal':
      return 'bg-red-500/10 text-red-500';
    default:
      return 'bg-gray-500/10 text-gray-500';
  }
};

export default function CommunityPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [newPostContent, setNewPostContent] = useState('');

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

  // Filter discussions based on search query and selected category
  const filteredDiscussions = discussionTopics.filter(topic => {
    const matchesSearch = 
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      topic.author.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || topic.category.toLowerCase() === selectedCategory.toLowerCase();
    
    return matchesSearch && matchesCategory;
  });

  // Sort discussions with pinned topics first, then by last activity
  const sortedDiscussions = [...filteredDiscussions].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return 0;
  });

  return (
    <div className="container mx-auto px-4 py-8 relative overflow-hidden">
      {/* Background gradient elements */}
      <div className="absolute -top-48 -right-48 w-96 h-96 bg-primary/5 rounded-full filter blur-3xl opacity-30 animate-pulse-slow" />
      <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-secondary/5 rounded-full filter blur-3xl opacity-30 animate-pulse-slow" />
      
      <motion.div
        initial="hidden"
        animate="show"
        variants={container}
        className="space-y-8"
      >
        {/* Page Header */}
        <motion.div variants={item} className="space-y-2">
          <h1 className="text-3xl font-bold">Community</h1>
          <p className="text-muted-foreground">
            Connect with creators, investors, and fans to discuss IP projects, share insights, and build relationships.
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Featured Creators */}
          <motion.div variants={item} className="lg:col-span-1 space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Featured Creators</h2>
              <div className="space-y-4">
                {featuredCreators.map((creator) => (
                  <div key={creator.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                    <Avatar className="h-10 w-10 border-2 border-primary/20">
                      <AvatarImage src={creator.avatar} alt={creator.name} />
                      <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <p className="font-medium truncate">{creator.name}</p>
                        {creator.verified && (
                          <Badge variant="outline" className="h-5 px-1 bg-blue-500/10 text-blue-500 border-0">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                              <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                            </svg>
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{creator.specialty}</p>
                    </div>
                    <div className="text-right text-sm">
                      <p className="font-medium">{creator.followers.toLocaleString()}</p>
                      <p className="text-muted-foreground">followers</p>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full">
                  <Users className="h-4 w-4 mr-2" />
                  View All Creators
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Popular Categories</h2>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 cursor-pointer">
                  <Film className="h-3 w-3 mr-1" />
                  Film
                </Badge>
                <Badge className="bg-purple-500/10 text-purple-500 hover:bg-purple-500/20 cursor-pointer">
                  <Music className="h-3 w-3 mr-1" />
                  Music
                </Badge>
                <Badge className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 cursor-pointer">
                  <BookOpen className="h-3 w-3 mr-1" />
                  Books
                </Badge>
                <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 cursor-pointer">
                  <Tv className="h-3 w-3 mr-1" />
                  Web Series
                </Badge>
                <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20 cursor-pointer">
                  Legal
                </Badge>
                <Badge className="bg-gray-500/10 text-gray-500 hover:bg-gray-500/20 cursor-pointer">
                  General
                </Badge>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Community Guidelines</h2>
              <div className="space-y-3 text-sm">
                <p>Our community thrives on respectful, constructive discussions. Please follow these guidelines:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Be respectful to all community members</li>
                  <li>Stay on topic and contribute meaningfully</li>
                  <li>No spam, solicitation, or self-promotion</li>
                  <li>Respect intellectual property rights</li>
                  <li>Report inappropriate content</li>
                </ul>
                <Button variant="link" className="p-0 h-auto">Read Full Guidelines</Button>
              </div>
            </Card>
          </motion.div>

          {/* Main Content - Discussions */}
          <motion.div variants={item} className="lg:col-span-2 space-y-6">
            {/* Create New Post */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Start a Discussion</h2>
              <div className="space-y-4">
                <Textarea 
                  placeholder="Share your thoughts, ask questions, or start a discussion..." 
                  className="min-h-[100px]"
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                />
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Film className="h-4 w-4 mr-1" />
                      Film
                    </Button>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button disabled={!newPostContent.trim()}>
                    <Send className="h-4 w-4 mr-2" />
                    Post
                  </Button>
                </div>
              </div>
            </Card>

            {/* Discussions */}
            <Card>
              <div className="p-6 border-b">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Discussions</h2>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search discussions" 
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <Tabs defaultValue="latest" className="w-full">
                <div className="px-6 border-b">
                  <TabsList className="w-full justify-start">
                    <TabsTrigger value="latest">Latest</TabsTrigger>
                    <TabsTrigger value="popular">Popular</TabsTrigger>
                    <TabsTrigger value="unanswered">Unanswered</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="latest" className="m-0">
                  <div className="divide-y">
                    {sortedDiscussions.map((topic) => (
                      <div key={topic.id} className="p-6 hover:bg-muted/30 transition-colors">
                        <div className="flex gap-4">
                          <Avatar className="h-10 w-10 flex-shrink-0">
                            <AvatarImage src={topic.author.avatar} alt={topic.author.name} />
                            <AvatarFallback>{topic.author.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-medium hover:text-primary cursor-pointer">{topic.title}</h3>
                              {topic.pinned && (
                                <Badge variant="outline" className="bg-primary/10 text-primary border-0">
                                  Pinned
                                </Badge>
                              )}
                              <Badge variant="outline" className={`flex items-center gap-1 ${getCategoryColorClass(topic.category)} border-0`}>
                                {getCategoryIcon(topic.category)}
                                <span>{topic.category}</span>
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <MessageCircle className="h-3 w-3" />
                                <span>{topic.replies} replies</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Heart className="h-3 w-3" />
                                <span>{topic.likes} likes</span>
                              </div>
                              <div>
                                <span>Last activity: {topic.lastActivity}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 mt-3">
                              <div className="text-sm">
                                <span className="font-medium">{topic.author.name}</span>
                                <span className="text-muted-foreground ml-1">· {topic.author.role}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4 justify-end">
                          <Button variant="ghost" size="sm">
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            Like
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MessageCircle className="h-4 w-4 mr-1" />
                            Reply
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Share2 className="h-4 w-4 mr-1" />
                            Share
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    {sortedDiscussions.length === 0 && (
                      <div className="text-center py-12">
                        <p className="text-muted-foreground">No discussions match your search criteria.</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="popular" className="m-0">
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">Popular discussions will appear here.</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="unanswered" className="m-0">
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">Unanswered discussions will appear here.</p>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
