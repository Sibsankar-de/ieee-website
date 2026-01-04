"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  FadeInAnimation,
  SlideUpAnimation,
} from "@/components/ui/sectionAnimation";
import { Select } from "@/components/ui/select";
import { TextArea } from "@/components/ui/textArea";
import axios from "axios";
import { Instagram, Linkedin, Mail, MailCheck, Phone } from "lucide-react";
import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";

export default function ContactPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  });

  function handleChange(field: string, value: string | any) {
    setForm((s) => ({ ...s, [field]: value }));
  }

  // handle send message
  const [isSending, setIsSending] = useState(false);
  const handleSendMessage = async (e: any) => {
    e.preventDefault();
    if (!form.firstName || !form.email || !form.subject || !form.message) {
      toast.error("Please fill all the fields");
      return;
    }

    if (!form.email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    // send message
    try {
      setIsSending(true);
      await axios.post("/api/message/create", form).then(() => {
        toast.success(
          "Message send successfully. We will get back to you soon!",
          {
            icon: <MailCheck className="text-green-400" />,
          }
        );
        setForm({
          firstName: "",
          lastName: "",
          email: "",
          subject: "",
          message: "",
        });
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.message || "Something went wrong");
      } else {
        toast.error("Something went wrong");
      }
    }

    setIsSending(false);
  };

  return (
    <div>
      <div className="page-title-box mb-8 !py-17">
        <h1 className="text-5xl font-bold text-white mb-2 text-center">
          Contact Us
        </h1>
        <p className="text-gray-300 text-lg text-center max-sm:text-sm">
          Get in touch with IEEE Student Branch. We're here to help with your
          questions, ideas, and collaboration opportunities.
        </p>
      </div>
      {/* form and contact info*/}
      <div className="flex justify-center gap-10 max-md:flex-col-reverse p-15 max-sm:p-2 mx-auto max-md:p-6 max-w-7xl mb-6 max-md:w-[95vw]">
        {/* form */}
        <SlideUpAnimation className="w-full max-w-2xl md:flex-2">
          <div className="flex flex-col md:max-w-2xl w-full">
            <h3 className="text-3xl mb-6">Send Us a Message</h3>
            {/* form card */}
            <div className="w-full max-w-3xl bg-white rounded-2xl border border-gray-200 p-6 max-sm:p-3 shadow-sm max-sm:w-full">
              <form aria-label="Contact form" onSubmit={handleSendMessage}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label
                      className="block text-sm font-semibold mb-2"
                      htmlFor="firstName"
                    >
                      First Name<span className="text-red-400">*</span>
                    </label>
                    <Input
                      id="firstName"
                      value={form.firstName}
                      placeholder="Enter your first name"
                      required
                      onChange={(e) => handleChange("firstName", e)}
                      disabled={isSending}
                    />
                  </div>

                  <div>
                    <label
                      className="block text-sm font-semibold mb-2"
                      htmlFor="lastName"
                    >
                      Last Name
                    </label>
                    <Input
                      id="lastName"
                      value={form.lastName}
                      placeholder="Enter your last name"
                      required
                      onChange={(e) => handleChange("lastName", e)}
                      disabled={isSending}
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label
                    className="block text-sm font-semibold mb-2"
                    htmlFor="email"
                  >
                    Email Address<span className="text-red-400">*</span>
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    placeholder="Enter your email"
                    required
                    onChange={(e) => handleChange("email", e)}
                    disabled={isSending}
                  />
                </div>

                <div className="mb-4">
                  <label
                    className="block text-sm font-semibold mb-2"
                    htmlFor="subject"
                  >
                    Subject<span className="text-red-400">*</span>
                  </label>
                  <Select
                    id="subject"
                    name="subject"
                    value={form.subject}
                    placeholder="Select a subject"
                    placeholderClass="!bg-white"
                    options={[
                      "General question",
                      "Events & workshops",
                      "Membership",
                      "Collaboration",
                    ]}
                    required
                    onChange={(value) => handleChange("subject", value)}
                    disabled={isSending}
                  />
                </div>

                <div className="mb-6">
                  <label
                    className="block text-sm font-semibold mb-2"
                    htmlFor="message"
                  >
                    Message<span className="text-red-400">*</span>
                  </label>
                  <TextArea
                    id="message"
                    value={form.message}
                    placeholder="Write your message"
                    rows={8}
                    required
                    onChange={(e) => handleChange("message", e)}
                    disabled={isSending}
                  />
                </div>

                <Button
                  className="w-full justify-center"
                  onClick={handleSendMessage}
                  disabled={isSending}
                >
                  {isSending ? "Sending message..." : "Send Message"}
                </Button>
              </form>
            </div>
          </div>
        </SlideUpAnimation>
        {/* contact and follow */}
        <div className="w-full md:flex-1">
          <FadeInAnimation>
            <h3 className="text-3xl mb-6">Get in Touch</h3>
          </FadeInAnimation>
          {/* contact details */}
          <div className="flex flex-col gap-4 w-full justify-center">
            <SlideUpAnimation>
              <div className="w-full h-fit rounded-lg  border border-gray-300 member-card flex flex-col justify-center relative overflow-hidden bg-white p-4 pr-8 gap-4">
                {/* icon */}
                <div className="flex items-center gap-3">
                  <span className="text-[var(--primary)]">
                    <Mail />
                  </span>
                  <h4 className="text-xl max-lg:text-lg">General Enquiries</h4>
                </div>
                <div className="flex flex-col gap-2 ">
                  {/* mail */}
                  <div className="flex gap-2 items-center">
                    <span className="text-gray-700">
                      <Mail size={18} />
                    </span>
                    <a href="mailto:ieee_sb@jgec.ac.in">
                      <span className="text-gray-700">ieee_sb@jgec.ac.in</span>
                    </a>
                  </div>
                </div>
              </div>
            </SlideUpAnimation>
            <SlideUpAnimation delay={0.3} className="">
              <div className="w-full h-full rounded-lg  border border-gray-300 member-card flex justify-center  relative overflow-hidden bg-white p-4 flex-col pr-30 gap-4">
                <h4 className="text-xl max-lg:text-lg">Follow Us</h4>
                {/* Social media icons */}
                <div className="flex items-center justify-start gap-4">
                  <a
                    href={
                      "https://www.linkedin.com/company/ieee-student-branch-jgec"
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-600 hover:text-blue-700"
                  >
                    <span>
                      <Linkedin size={24} />
                    </span>
                  </a>
                  <a
                    href={"https://www.instagram.com/ieee_jgec"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-600 hover:text-pink-500"
                  >
                    <span>
                      <Instagram size={24} />
                    </span>
                  </a>
                </div>
              </div>
            </SlideUpAnimation>
          </div>
        </div>
      </div>

      <ToastContainer
        position="top-center"
        autoClose={6000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        draggable
        theme="light"
      />
    </div>
  );
}
