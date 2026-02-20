export default function PersistantPlayer() {
  return (
    <section>

     <audio controls src={currentStream?.url} autoPlay />

    </section>
  );
}
