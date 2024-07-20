import React, { FC, useState } from "react";
import Image from "next/image";
import { Images, Loader2 } from "lucide-react";
import { Controller, useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

interface ImageFormProps {
  isPending: boolean;
  images: string[];
}

const ImageSkeleton = () => <Skeleton className="h-[250px] w-full rounded-lg bg-accent" />;

const LazyImage = ({ src, alt }: { src: string; alt: string }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative h-[250px] w-full">
      {isLoading && <ImageSkeleton />}
      <Image
        src={src}
        quality={100}
        alt={alt}
        fill
        className={`rounded-lg object-cover transition-opacity duration-300 ease-in-out ${isLoading ? "opacity-0" : "opacity-100"}`}
        onLoadingComplete={() => setIsLoading(false)}
      />
    </div>
  );
};

const ImageForm: FC<ImageFormProps> = ({ isPending, images }) => {
  const {
    formState: { defaultValues },
    control,
    watch,
  } = useFormContext();

  return (
    <div className="container mx-auto space-y-6 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Image Generator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Controller
              name="prompt"
              control={control}
              defaultValue={defaultValues?.input}
              render={({ field }) => (
                <Input {...field} type="text" placeholder="Enter your image prompt here" className="flex-grow" />
              )}
            />

            <Button type="submit" disabled={isPending || !watch("prompt")}>
              {isPending ? (
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

      {!images.length && (
        <div className="flex flex-col items-center justify-center pt-20">
          <p className="mb-5 animate-pulse pl-3 text-secondary-foreground">No images generated</p>
          <Images size={40} strokeWidth={2} className="animate-pulse text-secondary-foreground/50" />
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {images.map((image, index) => (
          <Card key={index}>
            <CardContent className="p-2">
              <LazyImage src={image} alt={`Generated image ${index + 1}`} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ImageForm;
