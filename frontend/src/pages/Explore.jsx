import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Explore.css";



const API_ROOT = "http://localhost:5000";

export default function Explore() {
  const [head, setHead] = useState([]);
  const [cols, setCols] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function run() {
      try {
        const [h, c] = await Promise.allSettled([
          axios.get(`${API_ROOT}/api/data/head`),
          axios.get(`${API_ROOT}/api/data/columns`),
        ]);
        if (h.status === "fulfilled") setHead(h.value.data || []);
        if (c.status === "fulfilled") setCols(c.value.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    run();
  }, []);

  if (loading) return <p>Loading…</p>;

  return (
    <div>
      <h1>Explore Dataset</h1>

      <div className="panel">
        <h3>Columns</h3>
        {cols.length ? (
          <div className="cols">
            {cols.map((c) => (
              <code key={c} className="chip">{c}</code>
            ))}
          </div>
        ) : (
          <p><i>No dataset found. Once you import your NYC CSV into MongoDB (e.g., collection <code>trips</code>), this will populate.</i></p>
        )}
      </div>

      <div className="panel">
        <h3>Head (first 10 rows)</h3>
        {head.length ? (
          <div className="table-scroll">
            <table className="table">
              <thead>
                <tr>
                  {Object.keys(head[0] || {}).map((k) => (
                    <th key={k}>{k}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {head.map((row, i) => (
                  <tr key={i}>
                    {Object.keys(head[0] || {}).map((k) => (
                      <td key={k}>{String(row[k])}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p><i>No rows yet.</i></p>
        )}
      </div>
    </div>
  );
}
