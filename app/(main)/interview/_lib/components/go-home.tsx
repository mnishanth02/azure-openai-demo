"use client";

import React from "react";
import { revalidatePath } from "next/cache";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const GoHome = () => {
  const handleNavigateToInterview = () => {
    revalidatePath("/interview");
  };

  return (
    <Link href={"/interview"} className={cn(buttonVariants(), "mt-4")} onClick={handleNavigateToInterview}>
      Go Home
    </Link>
  );
};

export default GoHome;
