export enum UserRole {
  SELLER = 'seller',
  BUYER = 'buyer',
  ADMIN = 'admin'
}

export enum GemStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export enum AuctionStatus {
  ACTIVE = 'active',
  ENDED = 'ended',
  CANCELLED = 'cancelled'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface Gem {
  _id: string;
  seller: {
    _id: string;
    name: string;
    email: string;
  };
  type: string;
  carat: number;
  cut: string;
  clarity: string;
  color: string;
  origin: string;
  description: string;
  images: string[];
  certificate: {
    url: string;
    authority: string;
    certificateNumber: string;
  };
  status: GemStatus;
  adminFeedback?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Bid {
  bidder: {
    _id: string;
    name: string;
    email: string;
  };
  amount: number;
  timestamp: string;
}

export interface Auction {
  _id: string;
  gem: Gem;
  seller: {
    _id: string;
    name: string;
    email: string;
  };
  startPrice: number;
  currentBid: number;
  minimumBidIncrement: number;
  startTime: string;
  endTime: string;
  status: AuctionStatus;
  bids: Bid[];
  winner?: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}