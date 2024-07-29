import { integer, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";
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

//  ***************** Interview ************************  //
//  ************* Postgres schema **********************  //
//  ****************************************************  //

export const personalInfo = pgTable("personal_info", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  address: text("address"),
  linkedin: varchar("linkedin", { length: 255 }),
  github: varchar("github", { length: 255 }),
  summary: text("summary"),
  fileName: varchar("file_name", { length: 255 }).notNull(),
});

export const education = pgTable("education", {
  id: serial("id").primaryKey(),
  resumeId: integer("resume_id").references(() => personalInfo.id, { onDelete: "cascade" }),
  institution: varchar("institution", { length: 255 }),
  degree: varchar("degree", { length: 255 }),
  fieldOfStudy: varchar("field_of_study", { length: 255 }),
  startDate: varchar("start_date", { length: 255 }),
  endDate: varchar("end_date", { length: 255 }),
  location: varchar("location", { length: 255 }),
  description: text("description"),
});

export const workExperience = pgTable("work_experience", {
  id: serial("id").primaryKey(),
  resumeId: integer("resume_id").references(() => personalInfo.id, { onDelete: "cascade" }),
  company: varchar("company", { length: 255 }),
  position: varchar("position", { length: 255 }),
  startDate: varchar("start_date", { length: 255 }),
  endDate: varchar("end_date", { length: 255 }),
  location: varchar("location", { length: 255 }),
  responsibilities: text("responsibilities"),
});

export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  resumeId: integer("resume_id").references(() => personalInfo.id, { onDelete: "cascade" }),
  skills: text("skills").notNull(),
});

export const certifications = pgTable("certifications", {
  id: serial("id").primaryKey(),
  resumeId: integer("resume_id").references(() => personalInfo.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }),
  issuingOrganization: varchar("issuing_organization", { length: 255 }),
  issueDate: varchar("issue_date", { length: 255 }),
  expirationDate: varchar("expiration_date", { length: 255 }),
  credentialId: varchar("credential_id", { length: 255 }),
  credentialUrl: varchar("credential_url", { length: 255 }),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  resumeId: integer("resume_id").references(() => personalInfo.id, { onDelete: "cascade" }),
  name: text("name"),
  description: text("description"),
  technologies: text("technologies"),
  startDate: varchar("start_date", { length: 255 }),
  endDate: varchar("end_date", { length: 255 }),
  role: text("role"),
});

export const languages = pgTable("languages", {
  id: serial("id").primaryKey(),
  resumeId: integer("resume_id").references(() => personalInfo.id, { onDelete: "cascade" }),
  languages: text("languages").notNull(),
});

export const additionalInfo = pgTable("additional_info", {
  id: serial("id").primaryKey(),
  resumeId: integer("resume_id").references(() => personalInfo.id, { onDelete: "cascade" }),
  info: text("info"),
});

export const resumeInterview = pgTable("resume_interview", {
  id: serial("id").primaryKey(),
  resumeId: integer("resume_id").references(() => personalInfo.id, { onDelete: "cascade" }),
  jobDescription: text("job_description").notNull(),
  startTime: timestamp("start_time"),
  endTtime: timestamp("end_time"),
  status: text("status").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const resumeQuestion = pgTable("resume_question", {
  id: serial("id").primaryKey(),
  interviewId: integer("interview_id").references(() => resumeInterview.id),
  question: text("question").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const resumeAnswer = pgTable("resume_answer", {
  id: serial("id").primaryKey(),
  questionId: integer("question_id").references(() => resumeQuestion.id),
  userAnswer: text("user_answer"),
  feedback: text("feedback"),
  rating: text("rating"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Zod schemas for insert and select
export const insertPersonalInfoSchema = createInsertSchema(personalInfo);
export const selectPersonalInfoSchema = createSelectSchema(personalInfo);

export const insertEducationSchema = createInsertSchema(education);
export const selectEducationSchema = createSelectSchema(education);

export const insertWorkExperienceSchema = createInsertSchema(workExperience);
export const selectWorkExperienceSchema = createSelectSchema(workExperience);

export const insertSkillsSchema = createInsertSchema(skills);
export const selectSkillsSchema = createSelectSchema(skills);

export const insertCertificationsSchema = createInsertSchema(certifications);
export const selectCertificationsSchema = createSelectSchema(certifications);

export const insertProjectsSchema = createInsertSchema(projects);
export const selectProjectsSchema = createSelectSchema(projects);

export const insertLanguagesSchema = createInsertSchema(languages);
export const selectLanguagesSchema = createSelectSchema(languages);

export const insertAdditionalInfoSchema = createInsertSchema(additionalInfo);
export const selectAdditionalInfoSchema = createSelectSchema(additionalInfo);

// You can further customize the Zod schemas if needed
export const customPersonalInfoSchema = z.object({
  ...insertPersonalInfoSchema.shape,
  // skills: { ...insertSkillsSchema.shape },
});
// Create custom schema
export const customPersonalInfoWithSkillsSchema = selectPersonalInfoSchema
  .omit({
    address: true,
    github: true,
    linkedin: true,
  })
  .extend({
    skills: selectSkillsSchema.shape.skills.nullable(),
  });

// Create a type from the schema
export type PersonalInfoWithSkills = z.infer<typeof customPersonalInfoWithSkillsSchema>;

// Create an array type to match the return type of getPersonalInfoWithSkills
// export type PersonalInfoWithSkillsArray = z.array(PersonalInfoWithSkills);

// Types for TypeScript
export type PersonalInfo = z.infer<typeof selectPersonalInfoSchema>;
export type NewPersonalInfo = z.infer<typeof insertPersonalInfoSchema>;
export type Education = z.infer<typeof selectEducationSchema>;
export type NewEducation = z.infer<typeof insertEducationSchema>;
export type WorkExperience = z.infer<typeof selectWorkExperienceSchema>;
export type NewWorkExperience = z.infer<typeof insertWorkExperienceSchema>;
export type Skills = z.infer<typeof selectSkillsSchema>;
export type NewSkills = z.infer<typeof insertSkillsSchema>;
export type Certifications = z.infer<typeof selectCertificationsSchema>;
export type NewCertifications = z.infer<typeof insertCertificationsSchema>;
export type Projects = z.infer<typeof selectProjectsSchema>;
export type NewProjects = z.infer<typeof insertProjectsSchema>;
export type Languages = z.infer<typeof selectLanguagesSchema>;
export type NewLanguages = z.infer<typeof insertLanguagesSchema>;
export type AdditionalInfo = z.infer<typeof selectAdditionalInfoSchema>;
export type NewAdditionalInfo = z.infer<typeof insertAdditionalInfoSchema>;
