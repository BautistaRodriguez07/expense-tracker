import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed (cleaning database)...");

  await prisma.expenseTag.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.expenseReceipt.deleteMany();
  await prisma.expenseSplit.deleteMany();
  await prisma.expense.deleteMany();
  await prisma.spaceInvitation.deleteMany();
  await prisma.spaceMember.deleteMany();
  await prisma.space.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  console.log("🗑️  Database cleaned successfully");

  const categories: Prisma.CategoryCreateManyInput[] = [
    // 🏠 Housing & Utilities
    { id: 1,  name: "Rent / Mortgage",         color: "#F97316", icon: "Home" },
      { id: 2,  name: "Home Maintenance",        color: "#EA580C", icon: "Hammer" },
      { id: 3,  name: "Electricity",             color: "#FACC15", icon: "Zap" },
      { id: 4,  name: "Water",                   color: "#22C55E", icon: "Droplets" },
      { id: 5,  name: "Gas",                     color: "#FDBA74", icon: "Flame" },
      { id: 6,  name: "Internet & Phone",        color: "#0EA5E9", icon: "Wifi" },
      { id: 7,  name: "Home Insurance",          color: "#22C55E", icon: "ShieldCheck" },
    
      // 🥑 Food & Groceries
      { id: 8,  name: "Groceries",               color: "#4ADE80", icon: "ShoppingBasket" },
      { id: 9,  name: "Dining Out",              color: "#FB7185", icon: "Utensils" },
      { id: 10, name: "Coffee & Snacks",         color: "#A855F7", icon: "Coffee" },
      { id: 11, name: "Alcohol & Bars",          color: "#F97373", icon: "Wine" },
    
      // 🚗 Transport & Vehicles
      { id: 12, name: "Public Transport",        color: "#22D3EE", icon: "Bus" },
      { id: 13, name: "Fuel",                    color: "#FACC15", icon: "Fuel" },
      { id: 14, name: "Taxi & Ride Sharing",     color: "#FB923C", icon: "CarFront" },
      // Parking is a good spot to show a react-icons fallback:
      { id: 15, name: "Parking & Tolls",         color: "#60A5FA", icon: "FaSquareParking" }, // react-icons/fa
      { id: 16, name: "Vehicle Maintenance",     color: "#22C55E", icon: "Wrench" },
      { id: 17, name: "Vehicle Insurance",       color: "#A3A3A3", icon: "Shield" },
    
      // ❤️ Health & Fitness
      { id: 18, name: "Health Insurance",        color: "#EF4444", icon: "ShieldPlus" },
      { id: 19, name: "Doctor & Hospital",       color: "#F97373", icon: "Stethoscope" },
      { id: 20, name: "Medication & Pharmacy",   color: "#FACC15", icon: "Pill" },
      { id: 21, name: "Fitness & Sports",        color: "#22C55E", icon: "Dumbbell" },
    
      // 👤 Personal & Family
      { id: 22, name: "Personal Care",           color: "#EC4899", icon: "Sparkles" },
      { id: 23, name: "Clothing & Shoes",        color: "#3B82F6", icon: "Shirt" },
      { id: 24, name: "Beauty & Cosmetics",      color: "#E879F9", icon: "Brush" },
      { id: 25, name: "Family & Childcare",      color: "#F97316", icon: "Baby" },
      { id: 26, name: "Education & Courses",     color: "#22C55E", icon: "GraduationCap" },
      { id: 27, name: "Subscriptions & Services",color: "#0EA5E9", icon: "Repeat" },
    
      // 🐾 Pets
      { id: 28, name: "Pet Food & Supplies",     color: "#22C55E", icon: "PawPrint" },
      { id: 29, name: "Vet & Pet Care",          color: "#F97373", icon: "HeartPulse" },
    
      // 🎉 Entertainment & Leisure
      { id: 30, name: "Streaming & Media",       color: "#6366F1", icon: "Tv" },
      { id: 31, name: "Games & Hobbies",         color: "#8B5CF6", icon: "Gamepad2" },
      { id: 32, name: "Books & Magazines",       color: "#FBBF24", icon: "BookOpenText" },
      { id: 33, name: "Events & Tickets",        color: "#FB7185", icon: "Ticket" },
    
      // 🛍️ Shopping & Lifestyle
      { id: 34, name: "Electronics & Gadgets",   color: "#0EA5E9", icon: "Smartphone" },
      { id: 35, name: "Home Decor & Furniture",  color: "#A855F7", icon: "Sofa" },
      { id: 36, name: "Gifts & Donations",       color: "#F97316", icon: "Gift" },
    
      // 💸 Finance, Debt & Fees
      { id: 37, name: "Bank Fees",               color: "#737373", icon: "ReceiptText" },
      { id: 38, name: "Taxes",                   color: "#EF4444", icon: "FileText" },
      { id: 39, name: "Loan Payments",           color: "#22C55E", icon: "Banknote" },
      { id: 40, name: "Credit Card Payments",    color: "#6366F1", icon: "CreditCard" },
    
      // 🌍 Travel
      { id: 41, name: "Travel - Transport",      color: "#0EA5E9", icon: "Plane" },
      { id: 42, name: "Travel - Lodging",        color: "#F97316", icon: "BedDouble" },
      { id: 43, name: "Travel - Activities",     color: "#22C55E", icon: "MapPin" },
    
      // 🧑‍💼 Work & Business
      { id: 44, name: "Business Expenses",       color: "#A3A3A3", icon: "BriefcaseBusiness" },
      { id: 45, name: "Software & SaaS",         color: "#22D3EE", icon: "AppWindow" },
      { id: 46, name: "Office Supplies",         color: "#FACC15", icon: "FolderCog" },
    
      // 💰 Savings & Investments
      { id: 47, name: "Emergency Fund",          color: "#22C55E", icon: "PiggyBank" },
      { id: 48, name: "Investments",             color: "#4ADE80", icon: "LineChart" },
      { id: 49, name: "Retirement",              color: "#0EA5E9", icon: "Landmark" },
    
      // 🎁 Miscellaneous & Other
      { id: 50, name: "Charity & Donations",     color: "#EC4899", icon: "HandHeart" },
      { id: 51, name: "Household Supplies",      color: "#EAB308", icon: "Broom" },
      { id: 52, name: "Unexpected / Misc",       color: "#9CA3AF", icon: "CircleEllipsis" },
    
      // 📥 Income Categories
      { id: 53, name: "Salary & Wages",          color: "#22C55E", icon: "WalletCards" },
      { id: 54, name: "Bonus & Commission",      color: "#4ADE80", icon: "BadgeDollarSign" },
      { id: 55, name: "Freelance & Side Hustle", color: "#0EA5E9", icon: "Briefcase" },
      { id: 56, name: "Investment Income",       color: "#22C55E", icon: "TrendingUp" },
      { id: 57, name: "Refunds & Reimbursements",color: "#F97316", icon: "Undo2" },
      { id: 58, name: "Gifts Received",          color: "#F97373", icon: "Gift" },
  ];

  await prisma.category.createMany({ data: categories });

  console.log("✅ Seed finished successfully");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
