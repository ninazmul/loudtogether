import PropTypes from "prop-types";
import { Link, User, Users } from "lucide-react";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import axios from "axios";
import { faker } from "@faker-js/faker";
import "react-toastify/dist/ReactToastify.css";

const truncate = (str, num = 30) => {
  if (str.length <= num) return str;
  return str.slice(0, num) + "...";
};

const SessionInfo = ({ session, audioInfo }) => {
  const { sessionId } = useParams();
  const shareableLink = `${import.meta.env.VITE_DOMAIN_NAME}/session/${
    session.sessionName
  }`;

  // Generate a random participant name
  const participantName = faker.person.fullName();

  const copyToClipboardAndJoin = async () => {
    navigator.clipboard.writeText(shareableLink);
    toast.success("Link copied to clipboard!");

    try {
      // Make a POST request to join the session
      const response = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/sessions/${
          sessionId || session._id
        }/join`,
        { participantName }
      );
      console.log("Joined session:", response.data);
    } catch (error) {
      console.error("Error joining session:", error);
      toast.error("Error joining session");
    }
  };

  return (
    <div className="space-y-4 mb-6">
      <div className="bg-white rounded-2xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-[#17D9A3] to-[#15c795] p-4">
          <div className="flex items-center">
            <div className="w-16 h-16 mr-4 rounded-lg overflow-hidden shadow-lg">
              <img
                src={audioInfo.thumbnailUrl}
                alt="Thumbnail"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-xs font-semibold text-white opacity-80">
                Now Playing
              </h2>
              <p className="text-sm font-bold text-white">
                {truncate(audioInfo.title || "Unknown Song", 45)}
              </p>
            </div>
          </div>
        </div>
        <div className="p-4 space-y-3">
          <div className="flex items-center bg-gray-50 rounded-xl p-3">
            <Link size={18} className="mr-3 text-[#17D9A3]" />
            <div className="flex-grow">
              <span className="text-xs font-semibold text-gray-400 block">
                URL
              </span>
              <span className="text-sm text-gray-700 line-clamp-1">
                {truncate(session.youtubeUrl)}
              </span>
            </div>
          </div>
          <div className="flex items-center bg-gray-50 rounded-xl p-3">
            <User size={18} className="mr-3 text-[#17D9A3]" />
            <div className="flex-grow">
              <span className="text-xs font-semibold text-gray-400 block">
                Admin
              </span>
              <span className="text-sm text-gray-700 line-clamp-1">
                {session.adminName}
              </span>
            </div>
          </div>
          <div className="flex items-center bg-gray-50 rounded-xl p-3">
            <Users size={18} className="mr-3 text-[#17D9A3]" />
            <div className="flex-grow">
              <span className="text-xs font-semibold text-gray-400 block">
                Participants
              </span>
              <span className="text-sm text-gray-700">
                {session.participants.length}
              </span>
            </div>
          </div>
          <div className="flex items-center bg-gray-50 rounded-xl p-3">
            <Link size={18} className="mr-3 text-[#17D9A3]" />
            <div className="flex-grow">
              <span className="text-xs font-semibold text-gray-400 block">
                Shareable Link
              </span>
              <div className="flex items-center w-48 md:w-full">
                <a
                  href={shareableLink}
                  className="text-sm text-blue-500 underline line-clamp-1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {truncate(shareableLink)}
                </a>
                <button
                  onClick={copyToClipboardAndJoin}
                  className="ml-2 text-xs text-white bg-[#17D9A3] px-2 py-1 rounded"
                >
                  Copy
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

SessionInfo.propTypes = {
  session: PropTypes.shape({
    _id: PropTypes.string,
    sessionName: PropTypes.string.isRequired,
    youtubeUrl: PropTypes.string.isRequired,
    adminName: PropTypes.string.isRequired,
    participants: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
  audioInfo: PropTypes.shape({
    title: PropTypes.string,
    thumbnailUrl: PropTypes.string,
    duration: PropTypes.number,
    _id: PropTypes.string,
  }).isRequired,
};

export default SessionInfo;
