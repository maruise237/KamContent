ALTER TABLE "scripts" ADD COLUMN "description" text;
ALTER TABLE "scripts" ADD COLUMN "hashtags" text[] NOT NULL DEFAULT '{}';
