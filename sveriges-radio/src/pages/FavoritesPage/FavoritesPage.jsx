import { Link } from "react-router-dom";

export default function FavoritesPage() {
  const favoriteChannelIds = JSON.parse(localStorage.getItem("favoriteChannelIds") ?? "[]");
  const favoriteProgramIds = JSON.parse(localStorage.getItem("favoriteProgramIds") ?? "[]");

  return (
    <section>
      <h1>Favoriter</h1>

      <h2>Kanaler</h2>
      {favoriteChannelIds.length === 0 ? (
        <p>Du har inga favoritkanaler ännu.</p>
      ) : (
        <ul>
          {favoriteChannelIds.map((channelId) => (
            <li key={channelId}>
              <Link to={`/channels/${channelId}`}>Channel #{channelId}</Link>
            </li>
          ))}
        </ul>
      )}

      <h2>Program</h2>
      {favoriteProgramIds.length === 0 ? (
        <p>Du har inga favoritprogram ännu.</p>
      ) : (
        <ul>
          {favoriteProgramIds.map((programId) => (
            <li key={programId}>
              <Link to={`/programs/${programId}`}>Program #{programId}</Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
