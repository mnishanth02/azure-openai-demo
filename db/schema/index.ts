import { pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const MockInterview = pgTable("mock_interview", {
  id: serial("id").primaryKey(),
  jsonMockResponse: text("json_mock_response").notNull(),
  jobPosition: varchar("job_position").notNull(),
  jobDesc: text("job_desc").notNull(),
  jobExperence: varchar("job_experence").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  mockId: varchar("mock_id").notNull(),
});
export const UserAnswer = pgTable("user_answer", {
  id: serial("id").primaryKey(),
  mockIdRef: varchar("mock_id").notNull(),
  question: text("question").notNull(),
  correctAns: text("correctAns"),
  userAns: text("userAns"),
  feedback: text("feedback"),
  rating: varchar("rating"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const selectMockInterviewSchema = createSelectSchema(MockInterview);

export type SelectMockInterviewType = z.infer<typeof selectMockInterviewSchema>;
