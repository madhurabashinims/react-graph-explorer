export default function Home() {
  return (
    <div>
      <h1>Welcome 👋</h1>
      <p>
        This dashboard connects to your backend at <code>http://localhost:5000</code>, reads
        the regression results you imported into MongoDB, and visualizes them.
      </p>
      <ul>
        <li><b>Graphs</b>: Compare Linear vs Huber vs RANSAC, with/without outliers.</li>
        <li><b>Explore</b>: Dataset sample & columns (will show placeholder until you import data).</li>
      </ul>
      <p>Use the top navigation to get started.</p>
    </div>
  );
}
