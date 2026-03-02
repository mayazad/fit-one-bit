import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🔥 Seeding Bangladeshi Kitchen data...');

    const bangladeshiFoods = [
        {
            name: 'Sada Bhat (White Rice)',
            calories: 130,
            protein: 2.7,
            carbs: 28,
            fat: 0.3,
            serving: '100g'
        },
        {
            name: 'Moshur Dal (Red Lentil Soup)',
            calories: 116,
            protein: 9,
            carbs: 20,
            fat: 0.4,
            serving: '100g'
        },
        {
            name: 'Rui Macher Jhol (Rohu Fish Curry)',
            calories: 142,
            protein: 16,
            carbs: 5,
            fat: 6,
            serving: '100g'
        }
    ];

    for (const food of bangladeshiFoods) {
        const foodItem = await prisma.foodItem.upsert({
            where: { name: food.name },
            update: {},
            create: food,
        });
        console.log(`✅ Upserted food: ${foodItem.name}`);
    }

    console.log('🎉 Seeding successfully completed.');
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
