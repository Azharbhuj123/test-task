import prisma from '../lib/prisma';

export class CampaignService {
  async getCampaigns(status?: string) {
    return prisma.campaign.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' }
    });
  }

  async getCampaignById(campaignId: string) {
    const campaign = await prisma.campaign.findUnique({ where: { id: campaignId } });
    if (!campaign) throw new Error(`Campaign with ID "${campaignId}" not found`);
    return campaign;
  }

  async getCampaignMetrics(campaignId: string) {
    return prisma.campaignMetric.findMany({
      where: { campaignId },
      orderBy: { date: 'desc' }
    });
  }

  async getRecentCampaignMetrics(campaignId: string, limit = 7) {
    return prisma.campaignMetric.findMany({
      where: { campaignId },
      orderBy: { date: 'desc' },
      take: limit
    });
  }

  async updateCampaignBudget(campaignId: string, newBudget: number) {
    await this.getCampaignById(campaignId);
    return prisma.campaign.update({ where: { id: campaignId }, data: { budget: newBudget } });
  }

  async pauseCampaign(campaignId: string) {
    await this.getCampaignById(campaignId);
    return prisma.campaign.update({ where: { id: campaignId }, data: { status: 'PAUSED' } });
  }

  async resumeCampaign(campaignId: string) {
    await this.getCampaignById(campaignId);
    return prisma.campaign.update({ where: { id: campaignId }, data: { status: 'ACTIVE' } });
  }

  async createCampaign(name: string, objective: string, budget: number) {
    return prisma.campaign.create({
      data: { name, objective, budget, status: 'DRAFT', currency: 'USD' }
    });
  }

  async updateCampaignObjective(campaignId: string, newObjective: string) {
    await this.getCampaignById(campaignId);
    return prisma.campaign.update({ where: { id: campaignId }, data: { objective: newObjective } });
  }

  async deleteCampaign(campaignId: string) {
    await this.getCampaignById(campaignId);
    return prisma.campaign.delete({ where: { id: campaignId } });
  }
}

export const campaignService = new CampaignService();
