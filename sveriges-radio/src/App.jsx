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

function AppLayout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <PersistentPlayer />
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<ChannelsPage />} />
        <Route path="/channels/:channelId" element={<ChannelsPageId />} />
        <Route path="/programs" element={<ProgramsPage />} />
        <Route path="/programs/:programId" element={<ProgramPageId />} />
        <Route path="/favorites" element={<FavoritesPage />} />
      </Route>
    </Routes>
  );
}
