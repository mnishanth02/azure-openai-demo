import ResumeChat from "./_lib/components/resume-chat";

const ResumeChatPage = () => {
  return (
    <main className="container mx-auto">
      <h1 className="mb-4 text-center text-2xl font-bold">
        Resume Matcher <p className="text-sm">(Chat with AI to shortlist your desired Resume)</p>
      </h1>
      <ResumeChat />
    </main>
  );
};

export default ResumeChatPage;
