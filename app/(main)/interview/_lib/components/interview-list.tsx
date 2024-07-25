import { FC } from "react";
import { desc } from "drizzle-orm";

import { db } from "@/db/db";
import { MockInterview } from "@/db/schema";
import InterviewItemCard from "./interview-item-card";

interface InterviewListProps {}

export const revalidate = 60;

const InterviewList: FC<InterviewListProps> = async ({}) => {
  const interList = await db.select().from(MockInterview).orderBy(desc(MockInterview.id));

  return (
    <section className="">
      <h2 className="text-xl font-medium">Previous Mock Interviews</h2>

      <div className="my-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {interList && interList.map((interview) => <InterviewItemCard mockInterview={interview} key={interview.id} />)}
      </div>
    </section>
  );
};

export default InterviewList;
