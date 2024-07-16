"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface GeneratedImage {
  id: string;
  url: string;
}

const ImageGeneratorUI: React.FC = () => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);

  const handlePromptChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(event.target.value);
  };

  const handleGenerateImage = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);

    // Simulating API call for image generation
    try {
      // This is a placeholder. Replace with actual API call.
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulating new generated images
      const newImages: GeneratedImage[] = [
        { id: Date.now().toString(), url: "/api/placeholder/512/512" },
        { id: (Date.now() + 1).toString(), url: "/api/placeholder/512/512" },
        { id: (Date.now() + 2).toString(), url: "/api/placeholder/512/512" },
        { id: (Date.now() + 3).toString(), url: "/api/placeholder/512/512" },
      ];

      setGeneratedImages((prevImages) => [...newImages, ...prevImages]);
      setPrompt("");
    } catch (error) {
      console.error("Error generating images:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto space-y-6 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Image Generator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Input
              type="text"
              placeholder="Enter your image prompt here"
              value={prompt}
              onChange={handlePromptChange}
              className="flex-grow"
            />
            <Button onClick={handleGenerateImage} disabled={isGenerating || !prompt.trim()}>
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Image"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {generatedImages.map((image) => (
          <Card key={image.id}>
            <CardContent className="p-2">
              <Image
                src={image.url}
                alt={`Generated image ${image.id}`}
                width={100}
                height={100}
                className="h-auto w-full rounded-lg"
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ImageGeneratorUI;
