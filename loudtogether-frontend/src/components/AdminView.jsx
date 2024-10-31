import React from "react";
import PropTypes from "prop-types";
import AudioControls from "./AudioControls";
import SessionInfo from "./SessionInfo";

const AdminView = React.memo(
  ({
    session,
    audioInfo,
    audioPlayerRef,
    handleTimeUpdate,
    handlePlayPause,
    isPlaying,
    currentTime,
  }) => (
    <>
      <SessionInfo session={session} audioInfo={audioInfo} />
      <AudioControls
        audioPlayerRef={audioPlayerRef}
        audioUrl={audioInfo.cloudinaryUrl}
        isAdmin={true}
        onTimeUpdate={handleTimeUpdate}
        onPlayPause={handlePlayPause}
        isPlaying={isPlaying}
        currentTime={currentTime}
      />
    </>
  )
);

AdminView.propTypes = {
  session: PropTypes.object.isRequired,
  audioInfo: PropTypes.object.isRequired,
  audioPlayerRef: PropTypes.object.isRequired,
  handleTimeUpdate: PropTypes.func.isRequired,
  handlePlayPause: PropTypes.func.isRequired,
  isPlaying: PropTypes.bool.isRequired,
  currentTime: PropTypes.number.isRequired,
};

AdminView.displayName = "AdminView";

export default AdminView;
