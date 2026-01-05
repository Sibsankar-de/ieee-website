"use client";

import { Card } from "@/components/ui/card";
import { SlideUpAnimation } from "@/components/ui/sectionAnimation";
import TeamMemberCard from "@/components/ui/teamMemberCard";
import { useStore } from "@/context/storeContext";
import axios from "axios";
import { Dot } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function TeamPage() {
  const [teamData, setTeamData] = useState<Record<string, any>[] | null>(null);

  const { teamStore, setTeamStore } = useStore();
  // load data from store first
  useEffect(() => {
    if (teamStore) {
      setTeamData(teamStore);
    }
  }, [teamStore]);

  useEffect(() => {
    (async () => {
      try {
        await axios.get("/api/team/get-team-feed").then((res) => {
          const data = res.data.data;
          if (data) {
            setTimeout(() => setTeamStore(data), 1000);
          }
        });
      } catch (error) {}
    })();
  }, []);

  return (
    <div>
      <div className="page-title-box mb-8 !py-17">
        <h1 className="text-5xl font-bold text-white mb-2 text-center">
          Meet Our Team
        </h1>
        <p className="text-gray-300 text-lg text-center max-sm:text-sm">
          Meet the passionate individuals driving IEEE's mission to advance
          technology and foster innovation on campus.
        </p>
      </div>
      {!teamData ? (
        //  Skeleton while loading
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-10 p-5 ">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className=" animate-pulse w-[300px] h-[400px] max-sm:w-full p-4 rounded-xl bg-gray-100 max-w-md transition-all duration-500 border border-gray-300 flex flex-col justify-center gap-1 relative overflow-hidden"
              >
                <div className="flex flex-col items-center">
                  {/* Cover Image */}
                  <div className="w-[60%] h-auto aspect-square rounded-full bg-gray-200"></div>

                  {/* Name and Role */}
                  <div className="flex flex-col justify-center items-center gap-1 w-[100%] rounded-xl p-3">
                    <h3 className="text-xl bg-[#afb1b7]  font-bold w-32 h-6 rounded-md mb-2"></h3>
                    <p className="text-xs text-[var(--primary)] bg-[#b2e3ffb4] backdrop-blur-sm inset-shadow-sm  rounded-xl px-3 py-1 w-20 h-6 mb-4"></p>
                  </div>
                  <div className="text-sm text-gray-400 flex flex-wrap justify-center">
                    <p className="w-20 h-4 rounded-sm bg-gray-200"></p>
                    <p>
                      <Dot />
                    </p>
                    <p className="w-20 h-4 rounded-sm bg-gray-200"></p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto">
          {teamData?.map((team, index) => (
            <div className="mb-12" key={index}>
              <h5 className="text-xl font-semibold text-center mb-6">
                {team?.title}
              </h5>
              <div className="grid md:grid-cols-3 lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-10 p-5">
                {team?.members?.map((member: any, index1: number) => (
                  <SlideUpAnimation
                    delay={(index * 1.5) / 10}
                    key={index1}
                    className="w-full justify-self-center flex justify-center"
                  >
                    <TeamMemberCard memberDetails={member} />
                  </SlideUpAnimation>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
