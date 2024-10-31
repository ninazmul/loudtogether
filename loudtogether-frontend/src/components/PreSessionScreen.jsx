//import React from "react";
import PropTypes from "prop-types";
import { Button } from "./ui/button";

const PreSessionScreen = ({ session, audioInfo, onStartListening }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Welcome to the Session!</h2>
      <p>You&apos;ve successfully joined the listening session for:</p>
      <div className="bg-gray-100 p-4 rounded-lg">
        <h3 className="font-semibold">{audioInfo.title}</h3>
        <p className="text-sm text-gray-600">Host: {session.adminName}</p>
      </div>
      <p>
        When you&apos;re ready, click the button below to start listening along
        with the group.
      </p>
      <Button
        onClick={onStartListening}
        className="w-full bg-[#17D9A3] text-white"
      >
        Start Listening
      </Button>
    </div>
  );
};

PreSessionScreen.propTypes = {
  session: PropTypes.object.isRequired,
  audioInfo: PropTypes.object.isRequired,
  onStartListening: PropTypes.func.isRequired,
};

export default PreSessionScreen;
