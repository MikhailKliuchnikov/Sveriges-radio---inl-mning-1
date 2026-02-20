import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
      {program.description ? <p>{program.description}</p> : null}
      {program.programimage ? <img src={program.programimage} alt={program.name} /> : null}
    </section>
  );
}
