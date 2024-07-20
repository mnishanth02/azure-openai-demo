import { FC, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

import { MessageT } from "./useAssistantForm";

interface VoiceSysthesiserProps {
  displaySettings: boolean;
  state: MessageT | undefined;
}

const VoiceSysthesiser: FC<VoiceSysthesiserProps> = ({ displaySettings, state }) => {
  const { control, watch } = useForm({
    defaultValues: {
      voice: "",
    },
    mode: "onChange",
  });
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [synth, setSynth] = useState<SpeechSynthesis | null>(null);
  const [pitch, setpitch] = useState(1);
  const [rate, setRate] = useState(1);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    if (window) {
      setSynth(window.speechSynthesis);
    }
  }, []);
  useEffect(() => {
    if (!state || !state.response || !synth) return;

    const wordsToSay = new SpeechSynthesisUtterance(state.response);
    wordsToSay.pitch = pitch;
    wordsToSay.rate = rate;
    wordsToSay.volume = volume;

    synth.speak(wordsToSay);

    return () => {
      synth.cancel();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const handleVoiceChange = (voiceName: string, onChange: any) => {
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find((v) => v.name === voiceName);

    if (!voice) return;
    setVoice(voice);
    onChange(voiceName);
  };

  const handlePitchChange = (e: number[]) => {
    console.log("e--->", e);

    setpitch(e[0]);
  };
  const handleRateChange = (e: number[]) => {
    setRate(e[0]);
  };
  const handleVolumeChange = (e: number[]) => {
    setVolume(e[0]);
  };

  return (
    <div className="flec flex-col items-center justify-center">
      {displaySettings && (
        <div className="flex flex-col items-center justify-center">
          <Controller
            name={"voice"}
            control={control}
            render={({ field: { onChange, value } }) => (
              <Select onValueChange={(name) => handleVoiceChange(name, onChange)} value={value}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select a voice" />
                </SelectTrigger>
                <SelectContent>
                  {window.speechSynthesis.getVoices().map((voice) => (
                    <SelectItem key={voice.name} value={voice.name}>
                      {voice.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <div className="flex pb-5">
            <div className="min-w-32 p-2">
              <Label>Pitch</Label>
              <Slider defaultValue={[pitch]} max={2} step={0.1} min={0.5} onValueChange={handlePitchChange} />
            </div>
            <div className="min-w-32 p-2">
              <Label>Speed</Label>
              <Slider defaultValue={[rate]} max={2} step={0.1} min={0.5} onValueChange={handleRateChange} />
            </div>
            <div className="min-w-32 p-2">
              <Label>Volume</Label>
              <Slider defaultValue={[volume]} max={2} step={0.1} min={0.5} onValueChange={handleVolumeChange} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceSysthesiser;
