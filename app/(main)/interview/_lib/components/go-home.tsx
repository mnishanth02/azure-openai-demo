"use client";

import React from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const GoHome = () => {
  return (
    <Link href={"/interview"} className={cn(buttonVariants(), "mt-4")}>
      Go Home
    </Link>
  );
};

export default GoHome;
