import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Home, Hash } from "lucide-react";
import { motion } from "framer-motion";
import Background from "../../components/Background";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from "../../components/ui/breadcrumb";
import { faker } from "@faker-js/faker"; 

const JoinSession = React.memo(() => {
  const [sessionId, setSessionId] = useState("");
  const navigate = useNavigate();

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const cleanSessionId = sessionId.split("/").pop();
      const randomName = faker.person.fullName();
      navigate(`/${cleanSessionId}`, {
        state: { participantName: randomName },
      });
    },
    [sessionId, navigate]
  );

  return (
    <div className="max-w-7xl mx-auto text-gray-800 min-h-screen flex flex-col rounded-[2rem] overflow-hidden relative p-4 md:p-8">
      <Background />

      <motion.div
        className="flex-grow flex flex-col md:px-8 pt-6 pb-4 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Breadcrumb className="my-2 md:mb-6">
          <BreadcrumbItem>
            <BreadcrumbLink
              href="/"
              className="text-[#17D9A3] hover:text-[#15c795]"
            >
              <Home className="w-4 h-4 mr-2 inline" />
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <span className="mx-2 text-gray-400">|</span>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink className="font-semibold">
              Join Session
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        <div className="flex-grow flex items-center justify-center">
          <Card className="shadow-lg bg-white/90 backdrop-blur-sm w-full max-w-md rounded-3xl md:p-6">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl md:text-3xl font-bold text-center text-[#17D9A3]">
                Join a Session
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label
                    htmlFor="sessionId"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Session ID
                  </label>
                  <div className="relative">
                    <Input
                      type="text"
                      id="sessionId"
                      value={sessionId}
                      onChange={(e) => setSessionId(e.target.value)}
                      required
                      className="pl-12 pr-4 rounded-full border-gray-300 shadow-sm focus:ring-2 focus:ring-[#17D9A3]"
                      placeholder="Enter session ID"
                    />
                    <Hash
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#17D9A3] to-[#15c795] text-white rounded-full py-3 text-center font-semibold shadow-lg transform transition-all duration-200 hover:scale-105"
                >
                  Join Session
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
});

JoinSession.displayName = "JoinSession";

export default JoinSession;
