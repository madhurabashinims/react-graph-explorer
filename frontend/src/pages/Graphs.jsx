import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

const API_ROOT = "http://localhost:5000"; // backend base

// Helper: normalize your one-document shape into a flat array for charts
function normalizeModels(doc) {
  // doc looks like:
  // {
  //   with_outliers: { linear: {...}, huber: {...}, ransac: {...} },
  //   without_outliers: { linear: {...}, huber: {...}, ransac: {...} },
  //   _id: ...
  // }
  if (!doc) return [];

  const out = [];
  const splits = ["with_outliers", "without_outliers"];
  const models = ["linear", "huber", "ransac"];

  splits.forEach((split) => {
    if (!doc[split]) return;
    models.forEach((m) => {
      if (!doc[split][m]) return;
      const { rmse, mae, r2 } = doc[split][m];
      out.push({
        split,
        model: m,
        rmse: Number(rmse),
        mae: Number(mae),
        r2: Number(r2),
      });
    });
  });

  return out;
}

export default function Graphs() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]); // normalized rows
  const [metric, setMetric] = useState("rmse"); // rmse | mae | r2

  useEffect(() => {
    async function fetchModels() {
      try {
        const res = await axios.get(`${API_ROOT}/api/models`);
        // Your backend returns an array (find().toArray()), but you imported one document.
        // So res.data is likely: [ { ...one document... } ]
        const doc = Array.isArray(res.data) ? res.data[0] : res.data;
        setRows(normalizeModels(doc));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchModels();
  }, []);

  const dataBySplit = useMemo(() => {
    // Turn flat rows into chart-friendly objects keyed by model per split
    // E.g. [{ name: "with_outliers", linear: 1.2, huber: 1.1, ransac: 1.3 }, ...]
    const map = new Map();
    rows.forEach((r) => {
      const key = r.split;
      if (!map.has(key)) map.set(key, { name: key });
      map.get(key)[r.model] = r[metric];
    });
    return Array.from(map.values());
  }, [rows, metric]);

  if (loading) return <p>Loading charts…</p>;
  if (!rows.length) return <p>No model data found. Did you import JSON and hit /api/models?</p>;

  return (
    <div>
      <h1>Model Comparison</h1>

      <div className="controls">
        <label>
          Metric:&nbsp;
          <select value={metric} onChange={(e) => setMetric(e.target.value)}>
            <option value="rmse">RMSE</option>
            <option value="mae">MAE</option>
            <option value="r2">R²</option>
          </select>
        </label>
      </div>

      <div className="panel">
        <h3>Grouped Bar Chart by Split</h3>
        <p>
          Comparing <b>Linear</b>, <b>Huber</b>, and <b>RANSAC</b> for
          <code> with_outliers</code> vs <code>without_outliers</code> using <b>{metric.toUpperCase()}</b>.
        </p>

        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height={360}>
            <BarChart data={dataBySplit}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="linear" />
              <Bar dataKey="huber" />
              <Bar dataKey="ransac" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="panel">
        <h3>Raw Table</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Split</th>
              <th>Model</th>
              <th>RMSE</th>
              <th>MAE</th>
              <th>R²</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => (
              <tr key={idx}>
                <td>{r.split}</td>
                <td>{r.model}</td>
                <td>{r.rmse?.toFixed(4)}</td>
                <td>{r.mae?.toFixed(4)}</td>
                <td>{r.r2?.toFixed(4)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
