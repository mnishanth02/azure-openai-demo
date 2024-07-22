CREATE TABLE IF NOT EXISTS "mock_interview" (
	"id" serial PRIMARY KEY NOT NULL,
	"json_mock_response" text NOT NULL,
	"job_position" varchar NOT NULL,
	"job_desc" text NOT NULL,
	"job_experence" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"mockId" varchar NOT NULL
);
