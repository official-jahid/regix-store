import { PrismaLibSql } from "@prisma/adapter-libsql";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { config } from "dotenv";
import { PrismaClient } from "../generated/prisma/client";

config({ path: ".env" });

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || "file:./prisma/dev.db",
});

const prisma = new PrismaClient({ adapter });

const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "sqlite" }),
  emailAndPassword: { enabled: true },
});

async function main() {
  console.log("🌱 Seeding database...");

  const adminEmail = process.env.ADMIN_EMAIL || "jahidekbalmallick@gmail.com";
  const adminName = process.env.ADMIN_USERNAME || "ceojahid";
  const adminPassword = process.env.ADMIN_PASSWORD || "ceoj@hid.admin";

  // Create admin user with Better Auth credential
  const existingUser = await prisma.user.findUnique({
    where: { email: adminEmail },
  });
  if (!existingUser) {
    try {
      const result: any = await auth.api.signUpEmail({
        body: { name: adminName, email: adminEmail, password: adminPassword },
        headers: new Headers({ "content-type": "application/json" }),
      } as any);

      if (result?.user?.id) {
        // Set admin role
        await prisma.user.update({
          where: { id: result.user.id },
          data: { role: "admin", emailVerified: true },
        });
        console.log(`✅ Admin user created: ${adminEmail}`);
      }
    } catch (e: any) {
      console.log(`⚠️ Admin creation attempt: ${e?.message}`);
      // Fallback: just create user record
      await prisma.user.upsert({
        where: { email: adminEmail },
        update: { role: "admin" },
        create: {
          id: crypto.randomUUID(),
          name: adminName,
          email: adminEmail,
          emailVerified: true,
          role: "admin",
          image: null,
        },
      });
      console.log(`✅ Admin user created (no password): ${adminEmail}`);
    }
  } else {
    await prisma.user.update({
      where: { id: existingUser.id },
      data: { role: "admin" },
    });
    console.log(`✅ Admin user already exists: ${adminEmail}`);
  }

  // Seed categories
  const categories = [
    {
      name: "Graphics & Design",
      slug: "graphics-design",
      description: "Logos, templates, illustrations, and more",
    },
    {
      name: "Development & IT",
      slug: "development-it",
      description: "Websites, apps, scripts, and code",
    },
    {
      name: "Writing & Content",
      slug: "writing-content",
      description: "Articles, copywriting, and documentation",
    },
    {
      name: "Video & Animation",
      slug: "video-animation",
      description: "Video editing, motion graphics, and more",
    },
    {
      name: "Music & Audio",
      slug: "music-audio",
      description: "Audio editing, voiceovers, and music",
    },
    {
      name: "Photography",
      slug: "photography",
      description: "Stock photos, presets, and filters",
    },
    {
      name: "Business & Marketing",
      slug: "business-marketing",
      description: "Business templates, marketing materials",
    },
    {
      name: "E-commerce",
      slug: "ecommerce",
      description: "Shopify themes, WooCommerce, and product listings",
    },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        id: crypto.randomUUID(),
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        sortOrder: categories.indexOf(cat),
      },
    });
  }
  console.log(`✅ ${categories.length} categories created`);

  console.log("✅ Seed complete!");
  console.log(`\n📋 Admin Login:`);
  console.log(`   Email: ${adminEmail}`);
  console.log(`   Password: ${adminPassword}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
