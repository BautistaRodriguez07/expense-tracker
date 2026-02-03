-- AlterTable
ALTER TABLE "notification" ADD COLUMN IF NOT EXISTS "inviter_id" TEXT;

-- Drop old duplicated fields (if present)
ALTER TABLE "notification" DROP COLUMN IF EXISTS "inviterName";
ALTER TABLE "notification" DROP COLUMN IF EXISTS "inviterImage";

-- CreateIndex
CREATE INDEX IF NOT EXISTS "notification_inviter_id_idx" ON "notification"("inviter_id");

-- AddForeignKey
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'notification_inviter_id_fkey'
  ) THEN
    ALTER TABLE "notification"
    ADD CONSTRAINT "notification_inviter_id_fkey"
    FOREIGN KEY ("inviter_id") REFERENCES "user"("id")
    ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;
