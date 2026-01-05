"use client";

import { Calendar, Clock, IndianRupee, MapPin } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Button } from "../../../../../components/ui/button";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import {
  formatDateStr,
  getDayDifference,
  to12Hour,
} from "@/lib/utils/formatDate";

export default function EventRegistration() {
  const params = useParams();
  const eventId = params.eventId;

  const router = useRouter();

  const [eventData, setEventData] = useState<Record<string, any> | null>(null);

  useEffect(() => {
    if (!eventId) return;
    (async () => {
      try {
        await axios.get(`/api/event/get?id=${eventId}`).then((res) => {
          const data = res.data.data;
          if (data) setEventData(data);
        });
      } catch (error) {
        router.push("/not-found");
      }
    })();
  }, [eventId]);

  if (!eventData) return <SkelentLoader />;

  return (
    <div className="mx-auto ">
      {/* Image and details */}
      <div
        className={" p-10 mx-auto relative bg-cover bg-center h-[450px] mb-8"}
        style={{ backgroundImage: `url(${eventData?.thumbnail})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        {/* event type */}
        <div className="absolute z-2 inset-0 space-y-8 flex flex-col justify-center p-10">
          {/* Title */}
          <div className="flex flex-col justify-c enter gap-3">
            <h2 className="text-white text-3xl md:text-4xl lg:text-6xl">
              {eventData?.title}
            </h2>
            <h4 className="text-white md:text-lg lg:text-xl">
              Stay tuned for more details and updates.
            </h4>
          </div>
          {/* date,time,venue */}
          <div className="flex gap-4 md:gap-7 flex-wrap items-center text-white">
            {eventData?.date && (
              <div className="flex justify-center items-center gap-2 py-2 px-4 rounded-lg bg-[#4f4f4f22] backdrop-blur-sm">
                <span className="text-green-400">
                  <Calendar />
                </span>
                <span>{formatDateStr(eventData.date).dateStr}</span>
              </div>
            )}
            {eventData?.time && (
              <div className="flex justify-center items-center gap-2 py-2 px-4 rounded-lg bg-[#4f4f4f22]  backdrop-blur-sm">
                <span className="text-orange-400">
                  <Clock />
                </span>
                <span>{to12Hour(eventData.time)}</span>
              </div>
            )}
            {eventData?.location && (
              <div className="flex justify-center items-center gap-2 py-2 px-4 rounded-lg bg-[#4f4f4f22]  backdrop-blur-sm">
                <span className="text-blue-400">
                  <MapPin />
                </span>
                <span>{eventData?.location}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Description and registration */}
      <div className="grid md:grid-cols-[70%_30%] gap-5 lg:gap-10 mx-auto max-sm:px-5 px-10 lg:px-20 my-12">
        <div>
          {/* About */}
          <h1 className="lg:text-4xl md:text-2xl text-xl mb-8">
            About This Event
          </h1>
          <div className="rounded-xl border-2 border-gray-200 border-l-5 border-l-[var(--primary)] p-8 bg-gray-100">
            <pre className="text-lg whitespace-pre-wrap font-sans">
              {eventData?.description}
            </pre>
          </div>
        </div>
        {/* registration */}
        <div className="shadow-2xl rounded-xl space-y-2 sticky top-[20px] h-fit bg-gray-100">
          <h2 className="text-center md:text-2xl lg:text-4xl text-xl p-3">
            Registration
          </h2>
          <div className="text-gray-600 border-t-2 border-[var(--background)] space-y-6 p-4">
            <div className="space-y-2">
              {eventData?.fee !== null && (
                <div className="flex gap-2">
                  Fee:{" "}
                  <span className="font-semibold text-[var(--foreground)]">
                    {eventData.fee === 0 ? (
                      <span>Free</span>
                    ) : (
                      <span className="flex items-center">
                        <IndianRupee size={15} />
                        {eventData.fee}
                      </span>
                    )}
                  </span>
                </div>
              )}
              {eventData?.deadline && (
                <div className="flex gap-2">
                  Deadline:{" "}
                  <span className="font-semibold text-[var(--foreground)]">
                    {formatDateStr(eventData.deadline).dateStr}
                  </span>
                </div>
              )}
            </div>
            {/* Regisration Button */}
            <a href={eventData?.navLink} target="_blank">
              <Button
                variant="primary"
                className="rounded-lg p-2 py-3 hover:scale-103 transition-all duration-200 w-full flex items-center justify-center text-md lg:text-lg"
                disabled={
                  !eventData?.navLink ||
                  getDayDifference(new Date(), eventData?.deadline) < 0
                }
              >
                Complete Registration
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

const SkelentLoader = () => {
  return (
    <div className="mx-auto animate-pulse h-full w-full">
      {/* Image and details */}
      <div
        className={
          " p-10 mx-auto relative bg-cover bg-center h-[450px] mb-8 w-full bg-gray-300 "
        }
      >
        {/* event type */}
        <div className="absolute z-2 inset-0 space-y-8 flex flex-col justify-center p-10">
          {/* Title */}
          <div className="flex flex-col justify-c enter gap-3">
            <h2 className="bg-gray-400 sm:w-[300px] w-[70%] h-[70px] rounded-lg"></h2>
            <h4 className="bg-gray-400 sm:w-[400px] w-[90%] h-[30px] rounded-lg"></h4>
          </div>
          {/* date,time,venue */}
          <div className="flex gap-4 md:gap-7 flex-wrap items-center text-white">
            <div className="w-[250px] h-[40px] rounded-lg bg-[#4f4f4f22] backdrop-blur-sm"></div>
            <div className="w-[250px] h-[40px] rounded-lg bg-[#4f4f4f22] backdrop-blur-sm"></div>
            <div className="w-[250px] h-[40px] rounded-lg bg-[#4f4f4f22] backdrop-blur-sm"></div>
          </div>
        </div>
      </div>
      {/* Description and registration */}
      <div className="grid md:grid-cols-[70%_30%] gap-5 lg:gap-10 mx-auto max-sm:px-5 px-10 lg:px-20 my-12">
        <div>
          {/* About */}
          <h1 className="w-[60%] h-[60px] mb-8 bg-gray-300 p-8 rounded-lg"></h1>
          <div className="rounded-xl border-2 border-gray-200 border-l-5 border-l-[var(--primary)] p-8 bg-gray-100 space-y-2">
            <p className="bg-gray-300 w-[80%] h-[25px]"></p>
            <p className="bg-gray-300 w-[88%] h-[25px]"></p>
            <p className="bg-gray-300 w-[89%] h-[25px]"></p>
            <br />
            <p className="bg-gray-300 w-[80%] h-[25px]"></p>
            <p className="bg-gray-300 w-[69%] h-[25px]"></p>
          </div>
        </div>
        {/* registration */}
        <div className=" rounded-xl flex flex-col justify-end sticky top-[20px] h-[250px] bg-white">
          {/* Regisration Button */}
          <div className="rounded-lg h-[200px] w-full "></div>
        </div>
      </div>
    </div>
  );
};
