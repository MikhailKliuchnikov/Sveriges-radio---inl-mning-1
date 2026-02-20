import { useCallback, useState } from "react";
import { Routes, Route, Outlet } from "react-router-dom";

import './App.css'
import ChannelsPage  from './pages/ChannelsPage/ChannelsPage';
import ProgramsPage  from './pages/ProgramsPage/ProgramsPage';
import FavoritesPage from './pages/FavoritesPage/FavoritesPage';
import ChannelsPageId from './pages/ChannelsPage/ChannelPageId'
import ProgramPageId from './pages/ProgramsPage/ProgramPageId';

import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import PersistentPlayer from './components/PersistantPlayer/PersistantPlayer';

export const BASE_URL = "https://api.sr.se/api/v2";

function mapChannelToStream(channel) {
  return {
    id: channel.id,
    name: channel.name,
    url: channel.liveaudio?.url ?? null,
  };
}

function AppLayout({
  currentStream,
  isPlaying,
  onTogglePlay,
  onNext,
  onPrevious,
  canNext,
  canPrevious,
  volume,
  onVolumeChange,
}) {
  return (
    <>
      <Header />
      <main className="app-main">
        <Outlet />
      </main>
      <PersistentPlayer
        currentStream={currentStream}
        isPlaying={isPlaying}
        onTogglePlay={onTogglePlay}
        onNext={onNext}
        onPrevious={onPrevious}
        canNext={canNext}
        canPrevious={canPrevious}
        volume={volume}
        onVolumeChange={onVolumeChange}
      />
      <Footer />
    </>
  );
}

export default function App() {
  const [currentStream, setCurrentStream] = useState(null);
  const [channelQueue, setChannelQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);

  const handleSetChannelQueue = useCallback(
    (channels) => {
      const queue = channels.map(mapChannelToStream).filter((item) => item.url);
      setChannelQueue(queue);

      if (currentStream) {
        const index = queue.findIndex((item) => item.id === currentStream.id);
        setCurrentIndex(index);
      }
    },
    [currentStream],
  );

  const handlePlayChannel = useCallback(
    (channel) => {
      const stream = mapChannelToStream(channel);
      if (!stream.url) return;

      const existingIndex = channelQueue.findIndex((item) => item.id === stream.id);

      if (existingIndex === -1) {
        setChannelQueue((prev) => [...prev, stream]);
        setCurrentIndex(channelQueue.length);
      } else {
        setCurrentIndex(existingIndex);
      }

      setCurrentStream(stream);
      setIsPlaying(true);
    },
    [channelQueue],
  );

  const handlePrevious = useCallback(() => {
    if (currentIndex <= 0) return;
    const nextIndex = currentIndex - 1;
    setCurrentIndex(nextIndex);
    setCurrentStream(channelQueue[nextIndex]);
    setIsPlaying(true);
  }, [channelQueue, currentIndex]);

  const handleNext = useCallback(() => {
    if (currentIndex < 0 || currentIndex >= channelQueue.length - 1) return;
    const nextIndex = currentIndex + 1;
    setCurrentIndex(nextIndex);
    setCurrentStream(channelQueue[nextIndex]);
    setIsPlaying(true);
  }, [channelQueue, currentIndex]);

  return (
    <Routes>
      <Route
        element={
          <AppLayout
            currentStream={currentStream}
            isPlaying={isPlaying}
            onTogglePlay={() => setIsPlaying((prev) => !prev)}
            onNext={handleNext}
            onPrevious={handlePrevious}
            canNext={currentIndex >= 0 && currentIndex < channelQueue.length - 1}
            canPrevious={currentIndex > 0}
            volume={volume}
            onVolumeChange={setVolume}
          />
        }
      >
        <Route
          path="/"
          element={
            <ChannelsPage
              onPlayChannel={handlePlayChannel}
              onSetChannelQueue={handleSetChannelQueue}
            />
          }
        >
          <Route index element={<p>Choose a channel from the left list.</p>} />
          <Route path="channels/:channelId" element={<ChannelsPageId />} />
        </Route>
        <Route path="/programs" element={<ProgramsPage />}>
          <Route index element={<p>Choose a program from the left list.</p>} />
          <Route path=":programId" element={<ProgramPageId />} />
        </Route>
        <Route path="/favorites" element={<FavoritesPage />} />
      </Route>
    </Routes>
  );
}
