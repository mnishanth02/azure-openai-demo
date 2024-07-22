import { eq } from "drizzle-orm";

import StartInterview from "@/app/(main)/interview/_lib/components/start-interview";

import { db } from "@/db/db";
import { MockInterview } from "@/db/schema";

interface StartInterviewPageProps {
  params: { mockId: string };
}

const StartInterviewPage = async ({ params }: StartInterviewPageProps) => {
  const [result] = await db.select().from(MockInterview).where(eq(MockInterview.mockId, params.mockId));

  return <StartInterview mockDetails={result} />;
};

export default StartInterviewPage;
