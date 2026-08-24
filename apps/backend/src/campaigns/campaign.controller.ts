import { Request, Response, NextFunction } from 'express';
import { campaignService } from './campaign.service';

export const getCampaigns = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const status = req.query.status as string | undefined;
    const campaigns = await campaignService.getCampaigns(status);
    res.json({ success: true, data: campaigns });
  } catch (error) {
    next(error);
  }
};

export const getCampaignById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const campaign = await campaignService.getCampaignById(req.params.id);
    res.json({ success: true, data: campaign });
  } catch (error) {
    next(error);
  }
};

export const getCampaignMetrics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const metrics = await campaignService.getCampaignMetrics(req.params.id);
    res.json({ success: true, data: metrics });
  } catch (error) {
    next(error);
  }
};
