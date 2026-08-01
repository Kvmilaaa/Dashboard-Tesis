type Props = {
  title: string;
  value: string;
  helper: string;
};

export default function StudyCard({ title, value, helper }: Props) {
  return (
    <article className="metric-card">
      <p className="metric-title">{title}</p>
      <h3 className="metric-value">{value}</h3>
      <p className="metric-helper">{helper}</p>
    </article>
  );
}
