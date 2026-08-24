import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const user = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      name: 'Demo User',
      email: 'demo@example.com',
    },
  });

  const campaignsData = [
    {
      name: 'Campaign Alpha',
      status: 'ACTIVE',
      objective: 'CONVERSIONS',
      budget: 100,
      currency: 'USD',
      spend: 72,
      impressions: 15000,
      clicks: 850,
      conversions: 18,
      conversionRate: 2.12,
    },
    {
      name: 'Campaign Beta',
      status: 'ACTIVE',
      objective: 'LEADS',
      budget: 150,
      currency: 'USD',
      spend: 110,
      impressions: 21000,
      clicks: 1100,
      conversions: 25,
      conversionRate: 2.27,
    },
    {
      name: 'Campaign Gamma',
      status: 'PAUSED',
      objective: 'TRAFFIC',
      budget: 80,
      currency: 'USD',
      spend: 60,
      impressions: 12000,
      clicks: 720,
      conversions: 10,
      conversionRate: 1.38,
    },
    {
      name: 'Campaign Delta',
      status: 'ACTIVE',
      objective: 'ENGAGEMENT',
      budget: 200,
      currency: 'USD',
      spend: 145,
      impressions: 35000,
      clicks: 2300,
      conversions: 40,
      conversionRate: 1.74,
    }
  ];

  for (const c of campaignsData) {
    const campaign = await prisma.campaign.create({
      data: c,
    });

    const dates = [
      '2026-08-20T00:00:00Z',
      '2026-08-21T00:00:00Z',
      '2026-08-22T00:00:00Z',
      '2026-08-23T00:00:00Z',
      '2026-08-24T00:00:00Z',
    ];

    for (let i = 0; i < dates.length; i++) {
      const multiplier = 1 + (i * 0.05); // slight variation
      await prisma.campaignMetric.create({
        data: {
          campaignId: campaign.id,
          date: new Date(dates[i]),
          impressions: Math.floor((c.impressions / 5) * multiplier),
          clicks: Math.floor((c.clicks / 5) * multiplier),
          spend: (c.spend / 5) * multiplier,
          conversions: Math.floor((c.conversions / 5) * multiplier),
          conversionRate: c.conversionRate,
        }
      });
    }
  }

  console.log('Database seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
