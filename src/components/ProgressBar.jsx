export default function ProgressBar({ nilai }) {
  const persen = Math.round(Math.min(Math.max(nilai, 0), 1) * 100);
  return (
    <div className="progress" role="progressbar" aria-valuenow={persen} aria-valuemin={0} aria-valuemax={100}>
      <div className="progress-isi" style={{ width: `${persen}%` }} />
    </div>
  );
}
