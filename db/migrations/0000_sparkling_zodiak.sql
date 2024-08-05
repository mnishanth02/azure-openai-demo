CREATE TABLE IF NOT EXISTS "mock_interview" (
	"id" serial PRIMARY KEY NOT NULL,
	"json_mock_response" text NOT NULL,
	"job_position" varchar NOT NULL,
	"job_desc" text NOT NULL,
	"job_experence" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"mock_id" varchar NOT NULL
);
--> statement-breakpoint
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
CREATE TABLE IF NOT EXISTS "additional_info" (
	"id" serial PRIMARY KEY NOT NULL,
	"resume_id" integer,
	"info" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "certifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"resume_id" integer,
	"name" varchar(255),
	"issuing_organization" varchar(255),
	"issue_date" varchar(255),
	"expiration_date" varchar(255),
	"credential_id" varchar(255),
	"credential_url" varchar(255)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "education" (
	"id" serial PRIMARY KEY NOT NULL,
	"resume_id" integer,
	"institution" varchar(255),
	"degree" varchar(255),
	"field_of_study" varchar(255),
	"start_date" varchar(255),
	"end_date" varchar(255),
	"location" varchar(255),
	"description" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "languages" (
	"id" serial PRIMARY KEY NOT NULL,
	"resume_id" integer,
	"languages" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "personal_info" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255),
	"phone" varchar(50),
	"address" text,
	"linkedin" varchar(255),
	"github" varchar(255),
	"summary" text,
	"file_name" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"resume_id" integer,
	"name" text,
	"description" text,
	"technologies" text,
	"start_date" varchar(255),
	"end_date" varchar(255),
	"role" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "resume_answer" (
	"id" serial PRIMARY KEY NOT NULL,
	"question_id" integer,
	"user_answer" text,
	"feedback" text,
	"rating" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "resume_interview" (
	"id" serial PRIMARY KEY NOT NULL,
	"resume_id" integer,
	"job_description" text NOT NULL,
	"start_time" timestamp,
	"end_time" timestamp,
	"status" text NOT NULL,
	"total_topics" integer DEFAULT 5 NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "resume_question" (
	"id" serial PRIMARY KEY NOT NULL,
	"interview_id" integer,
	"topic_id" integer,
	"question" text NOT NULL,
	"question_order" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "resume_topic" (
	"id" serial PRIMARY KEY NOT NULL,
	"interview_id" integer,
	"topic_name" varchar(255) NOT NULL,
	"topic_order" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "skills" (
	"id" serial PRIMARY KEY NOT NULL,
	"resume_id" integer,
	"skills" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "work_experience" (
	"id" serial PRIMARY KEY NOT NULL,
	"resume_id" integer,
	"company" varchar(255),
	"position" varchar(255),
	"start_date" varchar(255),
	"end_date" varchar(255),
	"location" varchar(255),
	"responsibilities" text
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "additional_info" ADD CONSTRAINT "additional_info_resume_id_personal_info_id_fk" FOREIGN KEY ("resume_id") REFERENCES "public"."personal_info"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "certifications" ADD CONSTRAINT "certifications_resume_id_personal_info_id_fk" FOREIGN KEY ("resume_id") REFERENCES "public"."personal_info"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "education" ADD CONSTRAINT "education_resume_id_personal_info_id_fk" FOREIGN KEY ("resume_id") REFERENCES "public"."personal_info"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "languages" ADD CONSTRAINT "languages_resume_id_personal_info_id_fk" FOREIGN KEY ("resume_id") REFERENCES "public"."personal_info"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "projects" ADD CONSTRAINT "projects_resume_id_personal_info_id_fk" FOREIGN KEY ("resume_id") REFERENCES "public"."personal_info"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "resume_answer" ADD CONSTRAINT "resume_answer_question_id_resume_question_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."resume_question"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "resume_interview" ADD CONSTRAINT "resume_interview_resume_id_personal_info_id_fk" FOREIGN KEY ("resume_id") REFERENCES "public"."personal_info"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "resume_question" ADD CONSTRAINT "resume_question_interview_id_resume_interview_id_fk" FOREIGN KEY ("interview_id") REFERENCES "public"."resume_interview"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "resume_question" ADD CONSTRAINT "resume_question_topic_id_resume_topic_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."resume_topic"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "resume_topic" ADD CONSTRAINT "resume_topic_interview_id_resume_interview_id_fk" FOREIGN KEY ("interview_id") REFERENCES "public"."resume_interview"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "skills" ADD CONSTRAINT "skills_resume_id_personal_info_id_fk" FOREIGN KEY ("resume_id") REFERENCES "public"."personal_info"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "work_experience" ADD CONSTRAINT "work_experience_resume_id_personal_info_id_fk" FOREIGN KEY ("resume_id") REFERENCES "public"."personal_info"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
