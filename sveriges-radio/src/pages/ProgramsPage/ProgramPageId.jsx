import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../App";

export default function ProgramPageId() {
  const { programId } = useParams();
  const [program, setProgram] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadProgram() {
      try {
        const response = await axios.get(`${BASE_URL}/programs/${programId}?format=json`);
        if (!isMounted) return;
        setProgram(response.data.program ?? null);
      } catch (err) {
        if (!isMounted) return;
        setError(err.message);
      }
    }

    loadProgram();
    return () => {
      isMounted = false;
    };
  }, [programId]);

  if (error) return <p>Error: {error}</p>;
  if (!program) return <p>Laddar program...</p>;

  return (
    <section>
      <h1>{program.name}</h1>
      {program.programimagewide ? (
        <img src={program.programimagewide} alt={program.name} />
      ) : program.programimage ? (
        <img src={program.programimage} alt={program.name} />
      ) : null}

      {program.description ? <p>{program.description}</p> : null}
      {program.broadcastinfo ? <p>{program.broadcastinfo}</p> : null}

      <ul>
        {program.email ? (
          <li>
            Email: <a href={`mailto:${program.email}`}>{program.email}</a>
          </li>
        ) : null}
        {program.phone ? <li>Phone: {program.phone}</li> : null}
        {program.programurl ? (
          <li>
            Program URL:{" "}
            <a href={program.programurl} target="_blank" rel="noreferrer">
              {program.programurl}
            </a>
          </li>
        ) : null}
        {program.programslug ? <li>Slug: {program.programslug}</li> : null}
        {program.channel ? (
          <li>
            Channel: <Link to={`/channels/${program.channel.id}`}>{program.channel.name}</Link>
          </li>
        ) : null}
        {program.responsibleeditor ? (
          <li>Responsible editor: {program.responsibleeditor}</li>
        ) : null}
        <li>Has on demand: {program.hasondemand ? "Yes" : "No"}</li>
        <li>Has pod: {program.haspod ? "Yes" : "No"}</li>
        <li>Archived: {program.archived ? "Yes" : "No"}</li>
      </ul>

      {program.socialmediaplatforms?.length ? (
        <>
          <h2>Social media</h2>
          <ul>
            {program.socialmediaplatforms.map((item) => (
              <li key={`${item.platform}-${item.platformurl}`}>
                <a href={item.platformurl} target="_blank" rel="noreferrer">
                  {item.platform}
                </a>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </section>
  );
}
