import AddNewInterview from "./_lib/components/add-new-interview";
import InterviewList from "./_lib/components/interview-list";

const InterviewPage = () => {
  return (
    <div className="mx-auto max-w-5xl">
      <h2 className="text-2xl font-bold">Dashboard</h2>
      <h2 className="text-secondary-foreground/80">Create and start your AI Mockup Interview</h2>
      <div className="my-5 grid grid-cols-1 md:grid-cols-3">
        <AddNewInterview />
      </div>
      <InterviewList />
    </div>
  );
};

export default InterviewPage;
