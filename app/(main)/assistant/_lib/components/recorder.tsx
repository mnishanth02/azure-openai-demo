import { FC, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { MicOff } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import inActiveIcon from "@/public/gemini.svg";
import activeIcon from "@/public/loading-gemini.svg";

interface RecorderProps {
  isPending: boolean;
  onUploadAudio: (file: File) => void;
}
const mimeType = "audio/webm";

const Recorder: FC<RecorderProps> = ({ isPending, onUploadAudio }) => {
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const [audioChunk, setAudioChunk] = useState<Blob[]>([]);
  const [permission, setPermission] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recordingStatus, setRecordingStatus] = useState<"recording" | "inactive">("inactive");

  useEffect(() => {
    getMicrophonePermission();
  }, []);

  const getMicrophonePermission = async () => {
    if ("MediaRecorder" in window) {
      try {
        const streamData = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        setPermission(true);
        setStream(streamData);
      } catch (error: any) {
        toast.error(`Microphone - ${error.message}`);
      }
    } else {
      alert("Your browser does not support the MediaRecorder API");
    }
  };
  const startRecording = async () => {
    if (stream === null || isPending || mediaRecorder === null) return;

    setRecordingStatus("recording");

    const media = new MediaRecorder(stream, { mimeType });
    mediaRecorder.current = media;
    mediaRecorder.current.start();

    let localAudioChunks: Blob[] = [];

    mediaRecorder.current.ondataavailable = (event) => {
      if (typeof event.data === "undefined") return;
      if (event.data.size === 0) return;

      localAudioChunks.push(event.data);
    };
    setAudioChunk(localAudioChunks);
  };

  const stopReording = async () => {
    if (mediaRecorder.current === null || isPending) return;
    mediaRecorder.current.stop();
    setRecordingStatus("inactive");

    mediaRecorder.current.onstop = () => {
      const audioBlob = new Blob(audioChunk, { type: mimeType });
      const file = new File([audioBlob], mimeType, { type: mimeType });
      onUploadAudio(file);
      setAudioChunk([]);
    };
  };

  return (
    <div className="mb-5 flex w-full items-center justify-center">
      {!permission && (
        <Button variant="outline" size="sm" type="button" onClick={getMicrophonePermission}>
          <MicOff className="mr-2 h-4 w-4 text-red-500" /> Get Microphone
        </Button>
      )}
      {isPending && (
        <Image
          src={activeIcon}
          className="h-12 object-contain p-1 grayscale"
          alt={"recording"}
          priority
          width={45}
          height={50}
        />
      )}

      {permission && recordingStatus === "inactive" && !isPending && (
        <Image
          src={inActiveIcon}
          alt={"recording"}
          className="h-12 cursor-pointer object-contain p-1 transition-all duration-150 ease-in-out hover:scale-110"
          priority
          onClick={startRecording}
          width={45}
          height={50}
        />
      )}
      {recordingStatus === "recording" && (
        <Image
          src={activeIcon}
          alt={"Recording"}
          className="h-12 cursor-pointer object-contain p-1 transition-all duration-150 ease-in-out hover:scale-110"
          priority
          onClick={stopReording}
          width={45}
          height={50}
        />
      )}
    </div>
  );
};

export default Recorder;
