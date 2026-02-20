import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../App";

export default function ChannelPageId() {
  const { channelId } = useParams();
  const [channel, setChannel] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadChannelData() {
      try {
        const [channelResponse, scheduleResponse] = await Promise.all([
          axios.get(`${BASE_URL}/channels/${channelId}?format=json`),
          axios.get(`${BASE_URL}/scheduledepisodes?channelid=${channelId}&format=json`),
        ]);

        if (!isMounted) return;
        setChannel(channelResponse.data.channel ?? null);
        setSchedule(scheduleResponse.data.schedule ?? []);
      } catch (err) {
        if (!isMounted) return;
        setError(err.message);
      }
    }

    loadChannelData();
    return () => {
      isMounted = false;
    };
  }, [channelId]);

  if (error) return <p>Error: {error}</p>;
  if (!channel) return <p>Laddar kanal...</p>;

  return (
    <section>
      <h1>{channel.name}</h1>
      {channel.tagline ? <p>{channel.tagline}</p> : null}
      <h2>Schema</h2>
      {schedule.length === 0 ? (
        <p>Inga sändningar hittades.</p>
      ) : (
        <ul>
          {schedule.slice(0, 20).map((episode) => (
            <li key={episode.id}>
              <strong>{episode.title}</strong>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
