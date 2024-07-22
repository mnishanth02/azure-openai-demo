import { FC } from "react";
import { eq } from "drizzle-orm";

import { db } from "@/db/db";
import { MockInterview } from "@/db/schema";
import Webcam from "../../_lib/components/webcam";

interface MockInterviewPageProps {
  params: { mockId: string };
}

const MockInterviewPage: FC<MockInterviewPageProps> = async ({ params }) => {
  const [mockDetails] = await db.select().from(MockInterview).where(eq(MockInterview.mockId, params.mockId));

  return (
    <div className="mx-auto my-4 flex max-w-5xl flex-col">
      <h2 className="mb-4 text-2xl font-bold">Lets Get started</h2>
      <Webcam mockDetails={mockDetails} />
    </div>
  );
};

export default MockInterviewPage;
