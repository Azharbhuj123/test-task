import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clean up existing data first so re-running seed is safe
  await prisma.toolExecution.deleteMany();
  await prisma.approvalRequest.deleteMany();
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.campaignMetric.deleteMany();
  await prisma.campaign.deleteMany();

  const user = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      name: 'Demo User',
      email: 'demo@example.com',
    },
  });
  console.log(`Demo user: ${user.id}`);

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
    const campaign = await prisma.campaign.create({ data: c });
    console.log(`  Created: ${campaign.name} (${campaign.id})`);

    // Seed 7 days of metrics
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      const fluctuation = 0.85 + Math.random() * 0.3; // 85%-115% daily variation

      await prisma.campaignMetric.create({
        data: {
          campaignId: campaign.id,
          date,
          impressions: Math.floor((c.impressions / 7) * fluctuation),
          clicks: Math.floor((c.clicks / 7) * fluctuation),
          spend: parseFloat(((c.spend / 7) * fluctuation).toFixed(2)),
          conversions: Math.floor((c.conversions / 7) * fluctuation),
          conversionRate: parseFloat((c.conversionRate * fluctuation).toFixed(2)),
        }
      });
    }
  }

  console.log('Database seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
