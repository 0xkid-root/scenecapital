export interface TokenDetails {
  symbol: string;
  tokenPrice: number;
  totalSupply: number;
  platform: string;
  contractAddress: string;
}

export interface RoyaltyStructure {
  streaming: string;
  theatrical: string;
  merchandise: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  type: string; // film, music, book, web-series, etc.
  images: string[];
  location: string;
  creator?: string; // Name of the creator/artist
  investors: number;
  returns: number;
  timeline: string;
  minInvestment: number;
  features: string[];
  target: number;
  raised: number;
  tokenDetails?: TokenDetails;
  royaltyStructure?: RoyaltyStructure;
}
