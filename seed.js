import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("password123", 10);

  // Create users with unique emails
  const user1 = await prisma.user.create({
    data: {
      name: "John Doe",
      phone: "1111111111",
      email: "john.unique@example.com",
      password,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: "Jane Smith",
      phone: "2222222222",
      email: "jane.unique@example.com",
      password,
    },
  });

  const user3 = await prisma.user.create({
    data: {
      name: "Alice Johnson",
      phone: "3333333333",
      email: "alice.unique@example.com",
      password,
    },
  });

  const user4 = await prisma.user.create({
    data: {
      name: "Bob Brown",
      phone: "4444444444",
      email: "bob.unique@example.com",
      password,
    },
  });

  // Create contacts for Alice Johnson
  await prisma.contact.createMany({
    data: [
      { name: "Charlie", phone: "5555555555", userId: user3.id },
      { name: "David", phone: "6666666666", userId: user3.id },
    ],
  });

  // Create contacts for Bob Brown
  await prisma.contact.createMany({
    data: [
      { name: "Eve", phone: "7777777777", userId: user4.id },
      { name: "Frank", phone: "8888888888", userId: user4.id },
    ],
  });

  // Create unregistered contacts
  await prisma.contact.createMany({
    data: [
      { name: "Grace", phone: "9999999999", userId: null },
      { name: "Heidi", phone: "1010101010", userId: null },
    ],
  });

  // Create spam reports
  await prisma.spamReport.createMany({
    data: [
      { phone: "1111111111", reportedById: user2.id },
      { phone: "2222222222", reportedById: user1.id },
      { phone: "1010101010", reportedById: user4.id },
    ],
  });

  console.log("Database seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
