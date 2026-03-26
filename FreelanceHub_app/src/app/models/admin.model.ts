export interface AdminStats {
  totalUsers: number;
  totalFreelancers: number;
  totalClients: number;
  pendingFreelancers: number;
  blockedUsers: number;
  totalProducts: number;
  totalAnnouncements: number;
  totalCategories: number;
  pendingReports: number;
}

export interface Report {
  _id: string;
  reportedBy: {
    userId: string;
    name: string;
    role: 'client' | 'freelancer';
  };
  targetType: 'user' | 'product' | 'announcement';
  targetId: string;
  targetName: string;
  reason: 'arnaque' | 'spam' | 'vol' | 'contenu_inapproprie' | 'autre';
  description: string;
  status: 'pending' | 'resolved' | 'ignored';
  createdAt: string;
  resolvedAt?: string | null;
}
