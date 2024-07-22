import React, { FC, useCallback, useEffect, useState } from "react";
import { Mic, Webcam } from "lucide-react";
import useSpeechToText, { ResultType } from "react-hook-speech-to-text";
import ReactWebcam from "react-webcam";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { QuestionAnswerT } from "./question-section";

interface RecordAnswerI {
  mockInterviewQuestions: QuestionAnswerT[];
  activeQuestionIndex: number;
  mockId: string;
}

const AnswerSection: FC<RecordAnswerI> = ({ activeQuestionIndex, mockInterviewQuestions, mockId }) => {
  const { error, interimResult, isRecording, results, startSpeechToText, stopSpeechToText } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  const [userAnswer, setUserAnswer] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const newTranscript = results.map((result) => (result as ResultType).transcript).join(" ");
    setUserAnswer((prevAns) => prevAns + " " + newTranscript);
  }, [results]);

  const updateUserAns = useCallback(async () => {
    if (userAnswer.trim().length <= 10) return;

    setLoading(true);

    const feedbackPrompt = `Question: ${mockInterviewQuestions[activeQuestionIndex]?.Question}, User Answer: ${userAnswer}. Based on the question and user answer, please provide a rating and feedback for improvement in 3 to 5 lines, in JSON format with 'rating' and 'feedback' fields.`;

    const promptObj = {
      mockId,
      question: mockInterviewQuestions[activeQuestionIndex]?.Question,
      correctAns: mockInterviewQuestions[activeQuestionIndex]?.Answer,
      userAns: userAnswer,
      feedbackPrompt,
    };

    try {
      const result = await fetch("/api/interview/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(promptObj),
      });

      if (!result.ok) {
        throw new Error("Failed to submit answer");
      }

      const resp = await result.json();
      console.log("Response:", resp);
      toast.success("User answer recorded successfully");
      setUserAnswer("");
    } catch (error) {
      console.error("Error updating user answer:", error);
      toast.error("Failed to record answer. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [userAnswer, mockId, mockInterviewQuestions, activeQuestionIndex]);

  useEffect(() => {
    if (!isRecording && userAnswer.trim().length > 10) {
      updateUserAns();
    }
  }, [isRecording, userAnswer, updateUserAns]);

  const startStopRecording = async () => {
    if (isRecording) {
      await stopSpeechToText();
    } else {
      await startSpeechToText();
    }
  };

  if (error) {
    return <p>Web Speech API is not available in this browser. Please try a different browser.</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center gap-5">
      <div className="relative mt-10 flex flex-col items-center justify-center rounded-lg bg-secondary p-8">
        <ReactWebcam
          mirrored
          style={{
            height: "100%",
            width: 400,
            zIndex: 20,
          }}
        />
      </div>
      <div>
        <Button variant={isRecording ? "destructive" : "default"} disabled={loading} onClick={startStopRecording}>
          {isRecording ? (
            <span className="flex items-center gap-2">
              <Mic className="animate-pulse" /> Stop Recording
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Mic /> {loading ? "Submitting..." : "Record Answer"}
            </span>
          )}
        </Button>
      </div>
    </div>
  );
};

export default AnswerSection;
