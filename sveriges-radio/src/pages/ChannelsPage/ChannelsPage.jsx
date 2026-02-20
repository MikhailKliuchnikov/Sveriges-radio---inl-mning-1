import { BASE_URL } from "../../App";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ChannelsPage() {
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

  if (error) return <p>Error: {error}</p>;
  if (isLoading && !data) return <p>Laddar...</p>;

  const channels = data?.channels ?? [];
  const hasPrevPage = page > 1;
  const hasNextPage = Boolean(data?.pagination?.nextpage);

  return (
    <>
      <ul>
        {channels.map((post) => (
          <li key={post.id}>
            <button
              onClick={() =>
                setCurrentStream({ name: post.name, url: post.liveaudio?.url })
              }
              disabled={!post.liveaudio?.url}
            >
              Play
            </button>
            <p>Channel name: {post.name}</p>
          </li>
        ))}
      </ul>
      <div>
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
    </>
  );
}
