import { Link } from "react-router-dom";

export default function FavoritesPage() {
  const favoriteChannels = JSON.parse(localStorage.getItem("favoriteChannels") ?? "[]");
  const favoritePrograms = JSON.parse(localStorage.getItem("favoritePrograms") ?? "[]");

  return (
    <section>
      <h1>Favoriter</h1>

      <h2>Kanaler</h2>
      {favoriteChannels.length === 0 ? (
        <p>Du har inga favoritkanaler ännu.</p>
      ) : (
        <ul>
          {favoriteChannels.map((channel) => (
            <li key={channel.id}>
              <Link to={`/channels/${channel.id}`}>{channel.name}</Link>
            </li>
          ))}
        </ul>
      )}

      <h2>Program</h2>
      {favoritePrograms.length === 0 ? (
        <p>Du har inga favoritprogram ännu.</p>
      ) : (
        <ul>
          {favoritePrograms.map((program) => (
            <li key={program.id}>
              <Link to={`/programs/${program.id}`}>{program.name}</Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
