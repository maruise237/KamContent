ALTER TABLE "profiles" ADD COLUMN "notif_weekly_recap" boolean NOT NULL DEFAULT true;
ALTER TABLE "profiles" ADD COLUMN "notif_daily_reminder" boolean NOT NULL DEFAULT true;
ALTER TABLE "profiles" ADD COLUMN "reminder_hour" integer NOT NULL DEFAULT 9;
