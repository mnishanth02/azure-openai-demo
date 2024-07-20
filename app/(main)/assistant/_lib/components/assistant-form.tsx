import { FC, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { BeatLoader } from "react-spinners";

import { cn } from "@/lib/utils";

import { MessageT } from "./useAssistantForm";

interface messageProps {
  messages: MessageT[];
  isPending: boolean;
}

const AssistantForm: FC<messageProps> = ({ messages, isPending }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  return (
    <div className={cn(`flex flex-col p-4 pt-20 ${messages.length > 0 ? "pb-80" : "pb-52"}`)}>
      {!messages.length && (
        <div className="absolute bottom-0 left-1/2 mb-28 flex -translate-x-1/2 transform flex-col items-center justify-end">
          <p className="mb-8 animate-pulse pl-3 text-secondary-foreground">Start a conversation</p>
          <ChevronDown
            size={40}
            strokeWidth={2}
            className="animate-bounce text-blue-400 text-secondary-foreground/50"
          />
        </div>
      )}
      <div className="space-y-5">
        {messages.map((msg) => (
          <div key={msg.id} className="space-y-5">
            {/* sender */}
            <div className="pl-48">
              <p className="message ml-auto rounded-br-none bg-primary text-left text-primary-foreground">
                {msg.sender}
              </p>
            </div>
            {/* reciever */}
            <div className="pr-40">
              <p className="message rounded-bl-none bg-accent text-accent-foreground">{msg.response}</p>
            </div>
          </div>
        ))}
      </div>

      {isPending && (
        <p className="message ml-auto mt-4">
          <BeatLoader />
        </p>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default AssistantForm;
