"use client";

import React from "react";
import { Button } from "./button";
import { Card } from "./card";
import { ChevronsRight } from "lucide-react";
import { formatDateStr } from "@/lib/utils/formatDate";
import { useRouter } from "next/navigation";

type EventCardProps = {
  title: string;
  date: string;
  description: string;
  coverImage?: string;
};

export default function EventCard({ event }: { event: Record<string, any> }) {
  const router = useRouter();
  return (
    <Card className="w-[800px] h-full">
      {/* Cover Image */}
      <img
        src={event?.thumbnail}
        alt={`cover`}
        className="rounded-lg object-cover w-full aspect-[5/3]"
      />

      {/* heading and Date */}
      <div className="flex justify-between w-[100%] p-3 max-md:flex-col gap-2">
        <h3 className="text-xl text-[#4b5365] font-bold line-clamp-2">
          {event?.title}
        </h3>
        {event?.date && (
          <p className="text-xs text-center text-[var(--primary)] bg-[#b2e3ffb4] backdrop-blur-sm inset-shadow-sm  rounded-xl px-3 py-1 w-fit h-fit whitespace-nowrap">
            {formatDateStr(event?.date).dateStr}
          </p>
        )}
      </div>
      {/* description */}
      <div className="p-3">
        <p className="text-sm text-gray-600 line-clamp-7">
          {event?.description}
        </p>
      </div>
      <div className="member-details flex flex-col justify-evenly bg-transparent shadow-lg/30 rounded-xl absolute left-[50%] -bottom-50 w-fit -translate-x-1/2 h-fit mx-auto z-10">
        <Button onClick={() => router.push(`/event/${event?._id}`)}>
          Learn More
          <ChevronsRight size={17} />
        </Button>
      </div>
    </Card>
  );
}
