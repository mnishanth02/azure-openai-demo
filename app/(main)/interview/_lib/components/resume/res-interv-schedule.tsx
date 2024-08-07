"use client";

import { FC } from "react";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { PersonalInfoWithSkills } from "@/db/schema";
import { useResumeScheduler } from "./useResumeScheduler";

interface ResumeInterviewScheduleProps {
  resumeList: PersonalInfoWithSkills[];
}

const ResumeInterviewSchedule: FC<ResumeInterviewScheduleProps> = ({ resumeList }) => {
  const { methods, onHandleSubmit, isPending } = useResumeScheduler();

  return (
    <div className="container mx-auto mt-10 p-4">
      <h1 className="mb-4 text-2xl font-bold">Personal Information Cards</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {resumeList.map((person) => (
          <Card key={person.id} className="w-full">
            <CardHeader>
              <CardTitle>{person.name}</CardTitle>
              <div className="flex flex-col">
                <CardDescription>{person.phone}</CardDescription>
                <CardDescription>{person.email}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-2 text-sm">{person.summary}</p>
              <p className="text-sm">
                <span className="font-semibold">Skills:</span> {person.skills}
              </p>
              <p className="mb-2 mt-4 text-sm font-semibold">Resume Name : {person.fileName}</p>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Schedule Interview</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Schedule Mock Interview with AI</DialogTitle>
                    <DialogDescription>Set the Job Description, date and time for the interview.</DialogDescription>
                  </DialogHeader>
                  <Form {...methods}>
                    <form onSubmit={onHandleSubmit} className="space-y-6">
                      <FormField
                        control={methods.control}
                        name="resumeId"
                        defaultValue={person.id?.toString()}
                        render={({ field }) => (
                          <FormItem hidden>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={methods.control}
                        name="jd"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Job Description</FormLabel>
                            <FormControl>
                              <Textarea className="max-h-80 min-h-40" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex items-center justify-end gap-2">
                        <FormField
                          control={methods.control}
                          name="date"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Date</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={methods.control}
                          name="time"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Time</FormLabel>
                              <FormControl>
                                <Input type="time" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <DialogFooter>
                        <Button type="submit" disabled={isPending}>
                          {isPending ? "Scheduling..." : "Schedule"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ResumeInterviewSchedule;
