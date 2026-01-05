"use client";

import { Card } from "@/components/ui/card";
import EventCard from "@/components/ui/eventCard";
import { SlideUpAnimation } from "@/components/ui/sectionAnimation";
import { useStore } from "@/context/storeContext";
import axios from "axios";
import { div } from "framer-motion/client";
import React, { useEffect, useState } from "react";

export default function EventPage() {
  const [eventData, seteventData] = useState<Record<string, any>[] | null>(
    null
  );

  const { eventStore, setEventStore } = useStore();
  // load data from store first
  useEffect(() => {
    if (eventStore) {
      seteventData(eventStore);
    }
  }, [eventStore]);

  useEffect(() => {
    (async () => {
      try {
        await axios.get("/api/event/get-all").then((res) => {
          const data = res.data.data;
          if (data) setTimeout(() => setEventStore(data), 1000);
        });
      } catch (error) {}
    })();
  }, []);

  return (
    <div className="max-md:mb-10">
      <div className="page-title-box mb-8 !py-17">
        <h1 className="text-5xl font-bold text-white mb-2">IEEE Events</h1>
        <p className="text-gray-300 text-lg text-center max-sm:text-sm">
          Join us for cutting-edge conferences, workshops, and networking events
          that shape the future of technology.
        </p>
      </div>
      {eventData == null ? (
        <div className="max-w-6xl grid mx-auto w-full grid-cols-1 md:grid-cols-2 gap-10 md:p-10 p-5">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="animate-pulse w-full h-fit rounded-lg transition-all duration-500 border border-gray-300 p-2 flex flex-col justify-center gap-1 relative overflow-hidden"
            >
              {/* Cover Image */}
              <div className="rounded-lg  w-full aspect-[5/3] bg-gray-300" />

              {/* heading and Date */}
              <div className="flex justify-between items-center w-[100%] p-3">
                <h3 className="text-xl text-[#4b5365] bg-gray-400 rounded-md font-bold w-24 h-6 "></h3>
                <p className="text-xs text-center text-[var(--primary)] bg-[#b2e3ffb4] backdrop-blur-sm inset-shadow-sm  rounded-xl px-3 py-1 w-20 h-6"></p>
              </div>
              {/* description */}
              <div className="p-3">
                <p className="text-sm text-gray-600 w-[95%] h-3 bg-gray-300 mb-1"></p>
                <p className="text-sm text-gray-600 w-[92%] h-3 bg-gray-300 mb-1"></p>
                <p className="text-sm text-gray-600 w-[98%] h-3 bg-gray-300 mb-1"></p>
                <p className="text-sm text-gray-600 w-[96%] h-3 bg-gray-300 mb-1"></p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="max-w-6xl grid mx-auto w-full grid-cols-1 md:grid-cols-2 gap-10 p-2 md:p-20">
          {eventData?.map((event, index) => (
            <SlideUpAnimation
              delay={(index * 1.5) / 10}
              key={index}
              className="w-fit justify-self-center"
            >
              <EventCard event={event} />
            </SlideUpAnimation>
          ))}
        </div>
      )}
    </div>
  );
}
