"use client";

import React from "react";
import { FileAudio, Globe, ImageIcon, MessageSquare, Mic } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const ServiceCard = ({ title, description, icon, route }: any) => (
  <Card className="flex min-h-[250px] flex-col justify-between">
    <CardHeader>
      <div className="flex items-center space-x-2">
        {icon}
        <CardTitle>{title}</CardTitle>
      </div>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardFooter>
      <Button className="w-full" onClick={() => (window.location.href = route)}>
        Try Now
      </Button>
    </CardFooter>
  </Card>
);

const ModernHomePage = () => {
  const services = [
    {
      title: "Translation Service",
      description: "Translate text between multiple languages with ease.",
      icon: <Globe className="h-6 w-6" />,
      route: "/translate",
    },
    {
      title: "Text to Speech",
      description: "Convert your text into natural-sounding speech.",
      icon: <MessageSquare className="h-6 w-6" />,
      route: "/text-to-speech",
    },
    {
      title: "Text to Image",
      description: "Generate unique images from textual descriptions.",
      icon: <ImageIcon className="h-6 w-6" />,
      route: "/text-to-image",
    },
    {
      title: "Audio to Text",
      description: "Transcribe audio files into text with high accuracy.",
      icon: <FileAudio className="h-6 w-6" />,
      route: "/audio-to-text",
    },
    {
      title: "Voice to Text",
      description: "Convert spoken words into written text in real-time.",
      icon: <Mic className="h-6 w-6" />,
      route: "/voice-to-text",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold">AI-Powered Language Services</h1>
        <p className="text-xl text-gray-600">Explore our suite of advanced language processing tools</p>
      </section>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service, index) => (
          <ServiceCard key={index} {...service} />
        ))}
      </div>
    </div>
  );
};

export default ModernHomePage;
