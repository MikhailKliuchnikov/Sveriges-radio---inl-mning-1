import { BASE_URL } from "../../App";
import { useEffect, useMemo, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import axios from "axios";

export default function ChannelsPage({ onPlayChannel, onSetChannelQueue }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const size = 20;

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    axios
      .get(`${BASE_URL}/channels`, {
        params: { format: "json", page, size },
      })
      .then((response) => setData(response.data))
      .catch((error) => setError(error.message))
      .finally(() => setIsLoading(false));
  }, [page]);

  const channels = data?.channels ?? [];
  const playableChannels = useMemo(
    () => channels.filter((channel) => channel.liveaudio?.url),
    [channels],
  );

  useEffect(() => {
    onSetChannelQueue(playableChannels);
  }, [onSetChannelQueue, playableChannels]);

  if (error) return <p>Error: {error}</p>;
  if (isLoading && !data) return <p>Laddar...</p>;

  const hasPrevPage = page > 1;
  const hasNextPage = Boolean(data?.pagination?.nextpage);

  return (
    <section className="split-layout">
      <aside className="left-panel">
        <h2>Channels</h2>
        <ul className="item-list">
          {channels.map((post) => (
            <li key={post.id} className="item-row">
              <button
                onClick={() => onPlayChannel(post)}
                disabled={!post.liveaudio?.url}
              >
                Play
              </button>
              <Link to={`/channels/${post.id}`}>{post.name}</Link>
            </li>
          ))}
        </ul>
        <div className="pagination">
          <button
            onClick={() => setPage((prev) => prev - 1)}
            disabled={!hasPrevPage || isLoading}
          >
            Prev
          </button>
          <span> Page {page} </span>
          <button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={!hasNextPage || isLoading}
          >
            Next
          </button>
        </div>
      </aside>
      <section className="detail-panel">
        <Outlet />
      </section>
    </section>
  );
}
