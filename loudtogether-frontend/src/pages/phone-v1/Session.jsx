import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import Pusher from "pusher-js";
import { motion } from "framer-motion";
import Background from "../../components/Background";
import ParticipantsModal from "../../components/ParticipantsModal";
import SplashScreen from "../../components/SplashScreen";
import AdminView from "../../components/AdminView";
import ParticipantView from "../../components/ParticipantView";
import PreSessionScreen from "../../components/PreSessionScreen";
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
import { Home, Users } from "lucide-react";

const Session = React.memo(() => {
  const { sessionId, sessionName } = useParams();
  const location = useLocation();
  const [session, setSession] = useState(null);
  const [audioInfo, setAudioInfo] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showParticipants, setShowParticipants] = useState(false);
  const audioPlayerRef = useRef(null);
  const lastSyncTime = useRef(0);
  const [showPreSession, setShowPreSession] = useState(false);
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;
  const VITE_KEY = import.meta.env.VITE_PUSHER_KEY;
  const VITE_CLUSTER = import.meta.env.VITE_PUSHER_CLUSTER;

  const syncAudioState = useCallback((time, playing) => {
    if (audioPlayerRef.current) {
      const currentTime = audioPlayerRef.current.currentTime;
      const timeDiff = Math.abs(currentTime - time);

      if (timeDiff > 0.5) {
        audioPlayerRef.current.currentTime = time;
      }

      setCurrentTime(time);
      setIsPlaying(playing);

      if (playing && audioPlayerRef.current.paused) {
        audioPlayerRef.current.play();
      } else if (!playing && !audioPlayerRef.current.paused) {
        audioPlayerRef.current.pause();
      }
    }
  }, []);

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        setIsLoading(true);

        const endpoint = sessionId
          ? `${SERVER_URL}/api/sessions/${sessionId}`
          : `${SERVER_URL}/api/sessions/session/${sessionName}`;

        const sessionResponse = await axios.get(endpoint);
        setSession(sessionResponse.data);

        setIsAdmin(
          sessionResponse.data.adminName === location.state?.participantName
        );

        const audioInfoResponse = await axios.get(
          `${SERVER_URL}/api/sessions/audio-info?youtubeUrl=${sessionResponse.data.youtubeUrl}`
        );
        setAudioInfo(audioInfoResponse.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching session data:", error);
        setError("Failed to load session data. Please try again.");
        setIsLoading(false);
      }
    };

    fetchSessionData();
  }, [sessionId, sessionName, location.state, SERVER_URL]);

  useEffect(() => {
    const pusher = new Pusher(VITE_KEY, { cluster: VITE_CLUSTER });
    const channel = pusher.subscribe(`session-${sessionId}`);

    channel.bind("audio-sync", (data) => {
      syncAudioState(data.currentTime, data.isPlaying);
    });

    channel.bind("participant-joined", (data) => {
      setSession((prevSession) => ({
        ...prevSession,
        participants: [...prevSession.participants, data.participantName],
      }));
    });

    channel.bind("participant-left", (data) => {
      setSession((prevSession) => ({
        ...prevSession,
        participants: prevSession.participants.filter(
          (name) => name !== data.participantName
        ),
      }));
    });

    return () => {
      pusher.unsubscribe(`session-${sessionId}`);
    };
  }, [sessionId, VITE_KEY, VITE_CLUSTER, syncAudioState]);

  useEffect(() => {
    const joinSession = async () => {
      if (location.state && location.state.participantName) {
        try {
          await axios.post(`${SERVER_URL}/api/sessions/${sessionId}/join`, {
            participantName: location.state.participantName,
          });
          const syncResponse = await axios.get(
            `${SERVER_URL}/api/sessions/${sessionId}/sync`
          );
          if (!isAdmin) {
            setShowPreSession(true);
          } else {
            syncAudioState(
              syncResponse.data.currentTime,
              syncResponse.data.isPlaying
            );
          }
        } catch (error) {
          console.error("Error joining session:", error);
          setError("Failed to join session. Please try again.");
        }
      }
    };

    joinSession();
  }, [sessionId, location.state, SERVER_URL, syncAudioState, isAdmin]);

  const handleStartListening = useCallback(() => {
    setShowPreSession(false);
    syncAudioState(currentTime, isPlaying);
  }, [currentTime, isPlaying, syncAudioState]);

  const handleTimeUpdate = useCallback(
    (time) => {
      setCurrentTime(time);
      if (isAdmin) {
        const now = Date.now();
        if (now - lastSyncTime.current > 500) {
          axios.post(`${SERVER_URL}/api/sessions/${sessionId}/sync`, {
            currentTime: time,
            isPlaying,
          });
          lastSyncTime.current = now;
        }
      }
    },
    [isAdmin, isPlaying, sessionId, SERVER_URL]
  );

  const handlePlayPause = useCallback(
    (playing) => {
      setIsPlaying(playing);
      if (audioPlayerRef.current) {
        if (playing) {
          audioPlayerRef.current.play();
        } else {
          audioPlayerRef.current.pause();
        }
      }

      if (isAdmin) {
        axios
          .post(`${SERVER_URL}/api/sessions/${sessionId}/sync`, {
            currentTime: audioPlayerRef.current?.currentTime || 0,
            isPlaying: playing,
          })
          .catch((error) => {
            console.error("Error syncing play/pause state:", error);
            setIsPlaying(!playing);
          });
      }
    },
    [isAdmin, sessionId, SERVER_URL]
  );

  //const handleNavigateBack = useCallback(() => navigate(-1), [navigate]);

  const memoizedAdminView = useMemo(
    () =>
      session && audioInfo ? (
        <AdminView
          session={session}
          audioInfo={audioInfo}
          audioPlayerRef={audioPlayerRef}
          handleTimeUpdate={handleTimeUpdate}
          handlePlayPause={handlePlayPause}
          isPlaying={isPlaying}
          currentTime={currentTime}
        />
      ) : null,
    [
      session,
      audioInfo,
      handleTimeUpdate,
      handlePlayPause,
      isPlaying,
      currentTime,
    ]
  );

  const memoizedParticipantView = useMemo(
    () =>
      session && audioInfo ? (
        <ParticipantView
          session={session}
          audioInfo={audioInfo}
          audioPlayerRef={audioPlayerRef}
          isPlaying={isPlaying}
          currentTime={currentTime}
          onTimeUpdate={handleTimeUpdate}
          onPlayPause={handlePlayPause}
        />
      ) : null,
    [
      session,
      audioInfo,
      isPlaying,
      currentTime,
      handleTimeUpdate,
      handlePlayPause,
    ]
  );

  const memoizedPreSessionScreen = useMemo(
    () =>
      session && audioInfo ? (
        <PreSessionScreen
          session={session}
          audioInfo={audioInfo}
          onStartListening={handleStartListening}
        />
      ) : null,
    [session, audioInfo, handleStartListening]
  );

  if (isLoading) {
    return <SplashScreen />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!session || !audioInfo) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>No session data available. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto text-gray-800 min-h-screen flex flex-col rounded-[2rem] overflow-hidden relative p-2 md:p-8">
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
            <BreadcrumbLink className="font-semibold">Session</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>

        <Card className="shadow-lg bg-white/90 backdrop-blur-sm w-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-[#17D9A3]">
              {isAdmin ? "Admin View" : "Participant View"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <h2 className="text-lg font-semibold line-clamp-2">
                {audioInfo.title}
              </h2>
              {sessionId ? (
                <p className="text-sm text-gray-500 line-clamp-1">
                  Session ID:
                  <span className="text-blue-500">{sessionId}</span>
                </p>
              ) : (
                <p className="text-sm text-gray-500 line-clamp-1">
                  Session Name:{" "}
                  <span className="text-blue-500">{sessionName}</span>
                </p>
              )}
            </div>
            {isAdmin
              ? memoizedAdminView
              : showPreSession
              ? memoizedPreSessionScreen
              : memoizedParticipantView}
            <Button
              onClick={() => setShowParticipants(true)}
              className="mt-4 w-full bg-[#17D9A3] hover:bg-[#1db88c] text-white"
            >
              <Users className="mr-2 h-4 w-4" /> View Participants
            </Button>
          </CardContent>
        </Card>
      </motion.div>
      {showParticipants && (
        <ParticipantsModal
          participants={session.participants}
          onClose={() => setShowParticipants(false)}
        />
      )}
    </div>
  );
});

Session.displayName = "Session";

export default Session;
