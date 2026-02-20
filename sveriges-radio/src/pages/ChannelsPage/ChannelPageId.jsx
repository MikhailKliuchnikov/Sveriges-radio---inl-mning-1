import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../App";

function formatSrUtc(srUtc) {
  const timestamp = Number(srUtc?.match(/\d+/)?.[0]);
  if (!timestamp) return "";

  return new Date(timestamp).toLocaleTimeString("sv-SE", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

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
          axios.get(
            `${BASE_URL}/scheduledepisodes?channelid=${channelId}&format=json`,
          ),
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
      {channel.image ? <img src={channel.image} alt={channel.name} /> : null}
      {channel.tagline ? <p>{channel.tagline}</p> : null}
      <ul>
        {channel.channeltype ? <li>Type: {channel.channeltype}</li> : null}
        {channel.color ? <li>Color: {channel.color}</li> : null}
        {channel.siteurl ? (
          <li>
            Website:{" "}
            <a href={channel.siteurl} target="_blank" rel="noreferrer">
              {channel.siteurl}
            </a>
          </li>
        ) : null}
        {channel.liveaudio?.url ? (
          <li>
            Live stream:{" "}
            <a href={channel.liveaudio.url} target="_blank" rel="noreferrer">
              Open stream
            </a>
          </li>
        ) : null}
      </ul>
      <h2>Schema</h2>
      {schedule.length === 0 ? (
        <p>Inga sändningar hittades.</p>
      ) : (
        <ul>
          {schedule.slice(0, 20).map((episode) => (
            <li key={episode.id}>
              <strong>{episode.title}</strong>{" "}
              <span>
                {formatSrUtc(episode.starttimeutc)} -{" "}
                {formatSrUtc(episode.endtimeutc)}
              </span>
              {episode.program?.id ? (
                <>
                  {" "}
                  <Link to={`/programs/${episode.program.id}`}>
                    ({episode.program.name ?? "Program"})
                  </Link>
                </>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
