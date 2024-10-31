import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { PlayIcon, PauseIcon } from "lucide-react";
import ReactPlayer from "react-player";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";
import { Slider } from "../components/ui/slider";
import { io } from "socket.io-client";

const socket = io(`${import.meta.env.VITE_SERVER_URL}`);

export default function AudioControls({
  audioUrl,
  isAdmin,
  onPlayPause,
  onTimeUpdate,
  isPlaying,
  currentTime,
}) {
  const [duration, setDuration] = useState(0);
  const [played, setPlayed] = useState(0);
  const playerRef = useRef(null);

  useEffect(() => {
    socket.on("playPause", (state) => {
      if (!isAdmin) {
        onPlayPause(state);
      }
    });

    return () => {
      socket.off("playPause");
    };
  }, [isAdmin, onPlayPause]);

  useEffect(() => {
    setPlayed(currentTime / duration);
  }, [currentTime, duration]);

  const handleDuration = (duration) => {
    setDuration(duration);
  };

  const handleProgress = (state) => {
    setPlayed(state.played);
    onTimeUpdate(state.playedSeconds);
  };

  const handlePlayPause = () => {
    if (isAdmin) {
      const newPlayingState = !isPlaying;
      socket.emit("playPause", newPlayingState);
      onPlayPause(newPlayingState);

      if (newPlayingState && playerRef.current) {
        playerRef.current.seekTo(currentTime, "seconds");
      }
    }
  };

  const handleSeek = (value) => {
    if (isAdmin) {
      const seekTime = (value[0] / 100) * duration;
      onTimeUpdate(seekTime);

      if (playerRef.current) {
        playerRef.current.seekTo(seekTime, "seconds");
      }
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <Card className="w-full max-w-7xl mx-auto overflow-hidden border border-gray-200 shadow-lg rounded-lg bg-white">
      <CardContent className="p-6">
        <ReactPlayer
          ref={playerRef}
          url={audioUrl}
          playing={isPlaying}
          onDuration={handleDuration}
          onProgress={handleProgress}
          onPlay={() => onPlayPause(true)}
          onPause={() => onPlayPause(false)}
          width="0"
          height="0"
          style={{ display: "none" }}
        />
        <div className="flex items-center justify-between mb-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handlePlayPause}
                  disabled={!isAdmin}
                  className={`w-12 h-12 rounded-full transition-transform ${
                    isAdmin
                      ? "bg-[#17D9A3] text-white hover:bg-[#1db88c]"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  } focus:ring-2 focus:ring-white focus:ring-opacity-50`}
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? (
                    <PauseIcon className="w-6 h-6" />
                  ) : (
                    <PlayIcon className="w-6 h-6" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {isAdmin
                    ? isPlaying
                      ? "Pause"
                      : "Play"
                    : "Only admin can control playback"}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <div className="text-[#17D9A3] font-medium">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>
        <Slider
          value={[played * 100]}
          onValueChange={handleSeek}
          max={100}
          step={1}
          disabled={!isAdmin}
          className="w-full mb-4"
        />
      </CardContent>
    </Card>
  );
}

AudioControls.propTypes = {
  audioUrl: PropTypes.string.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  onTimeUpdate: PropTypes.func.isRequired,
  onPlayPause: PropTypes.func.isRequired,
  isPlaying: PropTypes.bool.isRequired,
  currentTime: PropTypes.number.isRequired,
};
