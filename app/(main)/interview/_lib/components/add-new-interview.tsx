"use client";

import { FC } from "react";
import { LoaderCircle } from "lucide-react";
import { FormProvider } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import AddInterviewForm from "./add-interview-form";
import { useAddInterviewForm } from "./useAddInterviewForm";

interface AddNewInterviewProps {}

const AddNewInterview: FC<AddNewInterviewProps> = ({}) => {
  const { methods, onHandleSubmit, isPending } = useAddInterviewForm();

  return (
    <div>
      <Dialog>
        <DialogTrigger className="cursor-pointer rounded-lg border bg-secondary p-10 transition-all hover:scale-105 hover:shadow-md">
          <h2 className="text-center text-lg">+ Add New</h2>
        </DialogTrigger>
        <DialogContent>
          <FormProvider {...methods}>
            <form onSubmit={onHandleSubmit} className="flex flex-col">
              <DialogHeader>
                <DialogTitle className="text-2xl">Tell us more about your job interview</DialogTitle>
                <DialogDescription>
                  Add Details about your job position/role, Job description and years of experence
                </DialogDescription>
                <div>
                  <AddInterviewForm />
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant={"outline"}>
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type="submit" disabled={isPending}>
                    {isPending ? (
                      <>
                        <LoaderCircle className="mr-2 animate-spin" /> Generating from AI
                      </>
                    ) : (
                      "Start Interview"
                    )}
                  </Button>
                </DialogFooter>
              </DialogHeader>
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddNewInterview;
