import { FC } from "react";
import { Lightbulb, Volume2 } from "lucide-react";

export type QuestionAnswerT = {
  Answer: string;
  Question: string;
};

interface QuestionAnswerI {
  mockInterviewQuestions: QuestionAnswerT[];
  activeQuestionIndex: number;
}
const QuestionSection: FC<QuestionAnswerI> = ({ mockInterviewQuestions, activeQuestionIndex }) => {
  const textToSpeech = (question: string) => {
    if (window && "speechSynthesis" in window) {
      const speech = new SpeechSynthesisUtterance(question);
      window.speechSynthesis.speak(speech);
    } else {
      alert("Your browser does not support Text to Speech");
    }
  };

  console.log("questions->", mockInterviewQuestions);

  return (
    <div className="my-10 rounded-lg border p-5">
      <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
        {mockInterviewQuestions &&
          mockInterviewQuestions?.map((_, index) => (
            <h2
              key={index}
              className={`cursor-pointer rounded-full bg-accent p-2 text-center text-xs md:text-sm ${activeQuestionIndex === index && "bg-primary text-primary-foreground"}`}
            >
              Question #{index + 1}
            </h2>
          ))}
      </div>
      <h2 className="text-md my-5 md:text-lg">
        {mockInterviewQuestions && mockInterviewQuestions[activeQuestionIndex]?.Question}
      </h2>
      <Volume2
        className="cursor-pointer"
        onClick={() => textToSpeech(mockInterviewQuestions[activeQuestionIndex]?.Question)}
      />
      <div className="mt-20 rounded-lg border bg-accent p-5">
        <h2 className="flex items-center gap-2 text-accent-foreground">
          <Lightbulb />
          <strong>Note : </strong>
        </h2>
        <h3 className="my-2 ml-2 text-sm">
          Click on Record Answer button when you want to answer the question. At the end of the interiew we will give
          you the feedback along with the correct answer for each of the question and answer to compare.
        </h3>
      </div>
    </div>
  );
};

export default QuestionSection;
