export type Campaign = {
  id: string;
  name: string;
  status: string;
  budget: number;
  conversions?: number;
  spend?: number;
  createdAt: string;
  updatedAt: string;
};

export type CampaignMetric = {
  id: string;
  campaignId: string;
  date: string;
  spend: number;
  clicks: number;
  impressions: number;
  conversions: number;
};
