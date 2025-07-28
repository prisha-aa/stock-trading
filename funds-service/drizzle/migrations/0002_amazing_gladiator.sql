ALTER TABLE "outbox" ADD COLUMN "locked_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "outbox" ADD COLUMN "locked_by" text;