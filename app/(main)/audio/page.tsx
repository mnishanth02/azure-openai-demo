"use client";

import AudioProcessingUI from "../_lib/components/audioTranscribe";

const AudioPage = () => {
  const onTranscriptionSubmit = (file: File) => {
    const dummyFile = createDummyFile("example.txt", "text/plain", "Hello, World!");
    return dummyFile;
  };

  const onTranslationSubmit = (file: File) => {
    const dummyFile = createDummyFile("example.txt", "text/plain", "Hello, World!");
    return dummyFile;
  };

  return <AudioProcessingUI onTranscriptionSubmit={onTranscriptionSubmit} onTranslationSubmit={onTranslationSubmit} />;
};

export default AudioPage;

function createDummyFile(
  fileName: string = "test.txt",
  fileType: string = "text/plain",
  fileContent: string = "This is a test file"
): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      // Convert the file content to a Blob
      const blob = new Blob([fileContent], { type: fileType });

      // Create a File object from the Blob
      const file = new File([blob], fileName, { type: fileType });

      // Create a FileReader to read the file as a data URL
      const reader = new FileReader();

      reader.onload = (event) => {
        if (event.target && typeof event.target.result === "string") {
          resolve(event.target.result);
        } else {
          reject(new Error("Failed to read file"));
        }
      };

      reader.onerror = (error) => {
        reject(error);
      };

      // Read the file as a data URL
      reader.readAsDataURL(file);
    } catch (error) {
      reject(error);
    }
  });
}
