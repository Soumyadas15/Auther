"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";

interface BackButtonProps {
  href: string;
  label: string;
};

export const BackButton = ({
  href,
  label,
}: BackButtonProps) => {
  return (
    <div className="w-full flex items-center justify-center">
      <Link href={href} className="hover:underline underline-offset-4 text-center">
        {label}
      </Link>
    </div>
      
    
  );
};