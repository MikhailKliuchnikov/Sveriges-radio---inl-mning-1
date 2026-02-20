import { useEffect, useRef } from "react";

export default function PersistantPlayer({
  currentStream,
  isPlaying,
  onTogglePlay,
  onNext,
  onPrevious,
  canNext,
  canPrevious,
  volume,
  onVolumeChange,
}) {
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentStream?.url) return;

    if (isPlaying) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [currentStream, isPlaying]);

  return (
    <section className="persistent-player">
      <h3>Player</h3>
      <p>
        Current channel:{" "}
        {currentStream ? currentStream.name : "No channel selected"}
      </p>
      <div>
        <button onClick={onPrevious} disabled={!canPrevious}>
          Previous
        </button>
        <button onClick={onTogglePlay} disabled={!currentStream}>
          {isPlaying ? "Pause" : "Play"}
        </button>
        <button onClick={onNext} disabled={!canNext}>
          Next
        </button>
      </div>
      <label>
        Volume
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={volume}
          onChange={(event) => onVolumeChange(Number(event.target.value))}
        />
      </label>
      <audio
        ref={audioRef}
        src={currentStream?.url ?? ""}
        onPlay={() => {
          if (!isPlaying) onTogglePlay();
        }}
        onPause={() => {
          if (isPlaying) onTogglePlay();
        }}
      />
    </section>
  );
}
