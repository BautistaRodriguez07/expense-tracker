-- AlterTable
ALTER TABLE "notification" ADD COLUMN     "inviterImage" TEXT,
ADD COLUMN     "inviterName" TEXT;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "profile_image" TEXT;
