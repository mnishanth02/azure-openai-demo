"use client";

import React, { useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  message: z.string().min(1, { message: "Message is required" }),
});

type FormData = z.infer<typeof formSchema>;

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export default function ResumeChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const userMessage: ChatMessage = { role: "user", content: data.message };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/resume-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: data.message }),
      });

      if (!response.ok) {
        throw new Error("Search request failed");
      }

      const searchData = await response.json();

      if (searchData.result) {
        const aiMessage: ChatMessage = {
          role: "assistant",
          content: searchData.result,
        };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        const noResultsMessage: ChatMessage = {
          role: "assistant",
          content: "Sorry, I couldn't find any relevant information for your query.",
        };
        setMessages((prev) => [...prev, noResultsMessage]);
      }
    } catch (error) {
      console.error("Error querying AI:", error);
      const errorMessage: ChatMessage = {
        role: "assistant",
        content: "Sorry, there was an error processing your request. Please try again later.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      reset();
    }
  };

  return (
    <Card className="mx-auto w-full max-w-4xl">
      <CardContent>
        <div className="mb-4 min-h-[500px] space-y-4 overflow-y-auto p-4 pt-8">
          {messages.map((message, index) => (
            <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-lg p-3 text-sm ${
                  message.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary"
                }`}
              >
                {message.role === "user" ? (
                  message.content
                ) : (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({ node, ...props }) => <p className="mb-2" {...props} />,
                      ul: ({ node, ...props }) => <ul className="mb-2 list-disc pl-4" {...props} />,
                      ol: ({ node, ...props }) => <ol className="mb-2 list-decimal pl-4" {...props} />,
                      li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                      h1: ({ node, ...props }) => <h1 className="mb-2 text-xl font-bold" {...props} />,
                      h2: ({ node, ...props }) => <h2 className="mb-2 text-lg font-bold" {...props} />,
                      h3: ({ node, ...props }) => <h3 className="text-md mb-2 font-bold" {...props} />,
                      a: ({ node, ...props }) => <a className="text-blue-500 hover:underline" {...props} />,
                      code: ({ node, ...props }) => {
                        const isInline = node && (node as any)?.parent?.type === "inlineCode";
                        return (
                          <code
                            className={isInline ? "rounded bg-gray-200 px-1" : "mb-2 block rounded bg-gray-200 p-2"}
                            {...props}
                          />
                        );
                      },
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="flex space-x-2">
          <Input
            {...register("message")}
            placeholder="Type your message here..."
            className="flex-grow"
            disabled={isLoading}
            autoComplete="off"
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Send"}
          </Button>
        </form>
        {errors.message && <p className="mt-2 text-red-500">{errors.message.message}</p>}
      </CardContent>
    </Card>
  );
}
