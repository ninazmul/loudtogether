import React from "react";
import PropTypes from "prop-types";
import AudioControls from "./AudioControls";
import SessionInfo from "./SessionInfo";

const ParticipantView = React.memo(
  ({
    session,
    audioInfo,
    audioPlayerRef,
    isPlaying,
    currentTime,
    onTimeUpdate,
    onPlayPause,
  }) => (
    <>
      <SessionInfo session={session} audioInfo={audioInfo} />
      <AudioControls
        audioPlayerRef={audioPlayerRef}
        audioUrl={audioInfo.cloudinaryUrl}
        isAdmin={false}
        onTimeUpdate={onTimeUpdate}
        onPlayPause={onPlayPause}
        isPlaying={isPlaying}
        currentTime={currentTime}
      />
      <div className="bg-gray-100 rounded-xl p-4 mt-4">
        <p className="text-center text-sm text-gray-600">
          The admin controls the playback. You can listen along but not control
          the audio.
        </p>
      </div>
    </>
  )
);

ParticipantView.displayName = "ParticipantView";

ParticipantView.propTypes = {
  session: PropTypes.object.isRequired,
  audioInfo: PropTypes.object.isRequired,
  audioPlayerRef: PropTypes.object.isRequired,
  isPlaying: PropTypes.bool.isRequired,
  currentTime: PropTypes.number.isRequired,
  onTimeUpdate: PropTypes.func.isRequired,
  onPlayPause: PropTypes.func.isRequired,
};

export default ParticipantView;
