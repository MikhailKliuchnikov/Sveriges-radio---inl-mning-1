import { BASE_URL } from "../../App";
import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import axios from "axios";

export default function ProgramsPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const size = 20;

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    axios
      .get(`${BASE_URL}/programs/index`, {
        params: { format: "json", page, size },
      })
      .then((response) => setData(response.data))
      .catch((error) => setError(error.message))
      .finally(() => setIsLoading(false));
  }, [page]);

  if (error) return <p>Error: {error}</p>;
  if (isLoading && !data) return <p>Laddar...</p>;

  const programs = data?.programs ?? [];
  const hasPrevPage = page > 1;
  const hasNextPage = Boolean(data?.pagination?.nextpage);

  return (
    <section className="split-layout">
      <aside className="left-panel">
        <h2>Programs</h2>
        <ul className="item-list">
          {programs.map((post) => (
            <li key={post.id} className="item-row">
              <Link to={`/programs/${post.id}`}>{post.name}</Link>
            </li>
          ))}
        </ul>
        <div className="pagination">
          <button onClick={() => setPage((prev) => prev - 1)} disabled={!hasPrevPage || isLoading}>
            Prev
          </button>
          <span> Page {page} </span>
          <button onClick={() => setPage((prev) => prev + 1)} disabled={!hasNextPage || isLoading}>
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
