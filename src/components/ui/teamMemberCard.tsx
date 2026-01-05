import {
  Calendar,
  Component,
  Dot,
  GraduationCap,
  MapPin,
  Shield,
} from "lucide-react";
import { Instagram, Linkedin } from "lucide-react";
import React from "react";
import { Card } from "./card";
import { Avatar } from "./avatar";

type TeamMemberCardProps = {
  memberDetails: Record<string, any>;
};

export default function TeamMemberCard({ memberDetails }: TeamMemberCardProps) {
  return (
    <Card className=" w-[300px] h-[400px] p-4 rounded-xl bg-gray-100">
      <div className="flex flex-col items-center">
        {/* Cover Image */}
        <Avatar
          src={memberDetails?.avatar}
          className="object-cover w-[60%] h-auto aspect-square rounded-full"
        />

        {/* Name and Role */}
        <div className="flex flex-col justify-center items-center gap-1 w-[100%] rounded-xl p-3">
          <h3 className="text-xl text-[#4b5365]  font-bold ">
            {memberDetails?.name}
          </h3>
          {memberDetails?.role && (
            <p className="text-xs text-[var(--primary)] bg-[#b2e3ffb4] backdrop-blur-sm inset-shadow-sm  rounded-xl px-3 py-1 w-fit">
              {memberDetails?.role}
            </p>
          )}
        </div>
        <div className="text-sm text-gray-400 flex flex-wrap justify-center">
          <p>{memberDetails?.studyYear}</p>
          <p>
            <Dot />
          </p>
          <p>{memberDetails?.department}</p>
        </div>
      </div>

      {/* Member Details (hover) */}
      {(memberDetails?.socialMedia?.linkedin ||
        memberDetails?.socialMedia?.instagran) && (
        <div className="member-details flex flex-col justify-evenly px-5 py-3 bg-white shadow-lg/30 rounded-xl absolute left-[50%] -bottom-50 w-auto -translate-x-1/2 h-fit mx-auto z-10">
          {/* Social Buttons */}
          <div className="flex items-center justify-center gap-4">
            {memberDetails?.socialMedia?.linkedin && (
              <a
                href={memberDetails?.socialMedia.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-600 hover:text-blue-700"
              >
                <span>
                  <Linkedin size={24} />
                </span>
              </a>
            )}
            {memberDetails?.socialMedia?.instagran && (
              <a
                href={memberDetails?.socialMedia.instagran}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-600 hover:text-pink-500"
              >
                <span>
                  <Instagram size={24} />
                </span>
              </a>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
