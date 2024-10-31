import {
  useRef,
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { PlayCircle, PauseCircle, Volume2, VolumeX } from "lucide-react";
import PropTypes from "prop-types";

const AudioPlayer = forwardRef(
  ({ audioUrl, isAdmin, onTimeUpdate, onPlayPause }, ref) => {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);

    useImperativeHandle(ref, () => ({
      setCurrentTime: (time) => {
        if (audioRef.current) {
          audioRef.current.currentTime = time;
          setCurrentTime(time);
        }
      },
      play: () => {
        if (audioRef.current) {
          audioRef.current.play();
          setIsPlaying(true);
        }
      },
      pause: () => {
        if (audioRef.current) {
          audioRef.current.pause();
          setIsPlaying(false);
        }
      },
    }));

    useEffect(() => {
      if (audioRef.current) {
        audioRef.current.addEventListener("loadedmetadata", () => {
          setDuration(audioRef.current.duration);
        });
      }
    }, [audioUrl]);

    const togglePlayPause = () => {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
      onPlayPause(!isPlaying);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audioRef.current.currentTime);
      onTimeUpdate(audioRef.current.currentTime);
    };

    const handleSliderChange = (e) => {
      const value = parseFloat(e.target.value);
      audioRef.current.currentTime = value;
      setCurrentTime(value);
      onTimeUpdate(value);
    };

    const handleVolumeChange = (e) => {
      const value = parseFloat(e.target.value);
      setVolume(value);
      audioRef.current.volume = value;
      setIsMuted(value === 0);
    };

    const toggleMute = () => {
      if (isMuted) {
        audioRef.current.volume = volume;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    };

    const formatTime = (time) => {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60);
      return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    };

    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <audio ref={audioRef} src={audioUrl} onTimeUpdate={handleTimeUpdate} />

        {/* Time and progress bar */}
        <div className="mb-4">
          <input
            type="range"
            min={0}
            max={duration}
            value={currentTime}
            onChange={handleSliderChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#17D9A3]"
            disabled={!isAdmin}
          />
          <div className="flex justify-between text-sm text-gray-500 mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <button
            onClick={togglePlayPause}
            disabled={!isAdmin}
            className="text-[#17D9A3] hover:text-[#15c795] transition-colors disabled:opacity-50"
          >
            {isPlaying ? <PauseCircle size={48} /> : <PlayCircle size={48} />}
          </button>

          <div className="flex items-center">
            <button
              onClick={toggleMute}
              className="text-gray-500 hover:text-[#17D9A3] transition-colors mr-2"
            >
              {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.1}
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-24 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#17D9A3]"
            />
          </div>
        </div>
      </div>
    );
  }
);

AudioPlayer.displayName = "AudioPlayer";

AudioPlayer.propTypes = {
  audioUrl: PropTypes.string.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  onTimeUpdate: PropTypes.func.isRequired,
  onPlayPause: PropTypes.func.isRequired,
};

export default AudioPlayer;
