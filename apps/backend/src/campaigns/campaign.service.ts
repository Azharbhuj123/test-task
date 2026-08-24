import prisma from '../lib/prisma';

export class CampaignService {
  async getCampaigns(status?: string) {
    return prisma.campaign.findMany({
      where: status ? { status } : undefined,
    });
  }

  async getCampaignById(campaignId: string) {
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
    });
    if (!campaign) {
      throw new Error(`Campaign with ID ${campaignId} not found`);
    }
    return campaign;
  }

  async getCampaignMetrics(campaignId: string) {
    return prisma.campaignMetric.findMany({
      where: { campaignId },
      orderBy: { date: 'desc' },
    });
  }

  async getRecentCampaignMetrics(campaignId: string, limit: number = 5) {
    return prisma.campaignMetric.findMany({
      where: { campaignId },
      orderBy: { date: 'desc' },
      take: limit,
    });
  }
}

export const campaignService = new CampaignService();
