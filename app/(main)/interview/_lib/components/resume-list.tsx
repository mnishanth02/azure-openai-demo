import { FC } from "react";
import { eq } from "drizzle-orm";

import { db } from "@/db/db";
import { personalInfo, PersonalInfoWithSkills, skills } from "@/db/schema";
import ResumeInterviewSchedule from "./res-interv-schedule";

interface ResumeListProps {}

const ResumeList: FC<ResumeListProps> = async ({}) => {
  const getPersonalInfoWithSkills = async (): Promise<PersonalInfoWithSkills[]> => {
    return await db
      .select({
        id: personalInfo.id,
        name: personalInfo.name,
        email: personalInfo.email,
        phone: personalInfo.phone,
        summary: personalInfo.summary,
        fileName: personalInfo.fileName,
        skills: skills.skills,
      })
      .from(personalInfo)
      .leftJoin(skills, eq(personalInfo.id, skills.resumeId));
  };

  const result = await getPersonalInfoWithSkills();

  return <ResumeInterviewSchedule resumeList={result} />;
};

export default ResumeList;
