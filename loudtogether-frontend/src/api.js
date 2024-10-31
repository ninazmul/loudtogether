import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api";

export const createSession = (youtubeUrl, adminName) =>
  axios.post(`${API_BASE_URL}/sessions`, { youtubeUrl, adminName });

export const getSession = (sessionId) =>
  axios.get(`${API_BASE_URL}/sessions/${sessionId}`);

export const getSessionByName = (sessionName) =>
  axios.get(`${API_BASE_URL}/sessions/session/${sessionName}`);

export const joinSession = (sessionId, participantName) =>
  axios.post(`${API_BASE_URL}/sessions/${sessionId}/join`, { participantName });

export const getAudioInfo = (youtubeUrl) =>
  axios.get(`${API_BASE_URL}/sessions/audio-info`, { params: { youtubeUrl } });

export const syncAudio = (sessionId, currentTime, isPlaying) =>
  axios.post(`${API_BASE_URL}/sessions/${sessionId}/sync`, {
    currentTime,
    isPlaying,
  });
