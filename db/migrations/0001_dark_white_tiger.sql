CREATE TABLE IF NOT EXISTS "user_answer" (
	"id" serial PRIMARY KEY NOT NULL,
	"mock_id" varchar NOT NULL,
	"question" text NOT NULL,
	"correctAns" text,
	"userAns" text,
	"feedback" text,
	"rating" varchar,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "mock_interview" RENAME COLUMN "mockId" TO "mock_id";