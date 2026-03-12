# HMS

# Generate the Prisma Client
yarn prisma generate

# Sync your schema to MongoDB Atlas
yarn prisma db push

npx ts-node prisma/seed.ts