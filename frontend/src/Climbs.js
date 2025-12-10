import { useEffect, useState } from "react";
import { api } from "./api";

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line,
  PieChart, Pie
} from "recharts";

export default function Climbs({ token }) {
  const [climbs, setClimbs] = useState([]);
  const [form, setForm] = useState({
    climbType: "",
    grade: "",
    attempts: 1,
  });

  const [editingClimb, setEditingClimb] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // -----------------------
  // LOAD CLIMBS
  // -----------------------
  useEffect(() => {
    loadClimbs();
  }, []);

  async function loadClimbs() {
    const res = await api.get("/climbs");
    setClimbs(res.data);
  }

  // -----------------------
  // ADD CLIMB
  // -----------------------
  async function addClimb() {
    if (!form.climbType.trim() || !form.grade.trim()) {
      alert("Please enter climb type and grade.");
      return;
    }

    await api.post("/climbs", form, {
      headers: { Authorization: token },
    });

    setForm({ climbType: "", grade: "", attempts: 1 });
    loadClimbs();
  }

  // -----------------------
  // EDIT CLIMB
  // -----------------------
  async function handleEdit() {
    await api.put(`/climbs/${editingClimb._id}`, editingClimb, {
      headers: { Authorization: token },
    });
    setShowEditModal(false);
    loadClimbs();
  }

  // -----------------------
  // DELETE CLIMB
  // -----------------------
  async function handleDelete() {
    await api.delete(`/climbs/${editingClimb._id}`, {
      headers: { Authorization: token },
    });
    setShowDeleteModal(false);
    loadClimbs();
  }

  // -----------------------
  // ANALYTICS
  // -----------------------

  // 1️⃣ Climbs per grade
  const gradeCounts = climbs.reduce((acc, c) => {
    acc[c.grade] = (acc[c.grade] || 0) + 1;
    return acc;
  }, {});

  const gradeChartData = Object.entries(gradeCounts).map(([grade, count]) => ({
    grade,
    count
  }));

  // 2️⃣ Climbs per type
  const typeChartData = Object.entries(
    climbs.reduce((acc, c) => {
      acc[c.climbType] = (acc[c.climbType] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  // 3️⃣ Attempts over time
  const attemptsOverTime = climbs
    .map((c, i) => ({ index: i + 1, attempts: c.attempts }))
    .reverse();

  // 4️⃣ Attempts distribution
  const attemptsDist = Object.entries(
    climbs.reduce((acc, c) => {
      acc[c.attempts] = (acc[c.attempts] || 0) + 1;
      return acc;
    }, {})
  ).map(([attempts, count]) => ({ attempts, count }));

  // -----------------------
  // RENDER UI
  // -----------------------
  return (
    <div className="max-w-6xl mx-auto space-y-12">

      {/* ADD CLIMB CARD */}
      <div className="card bg-base-100 p-8 shadow-xl">
        <h3 className="text-2xl font-semibold mb-6">Add New Climb</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            className="input input-bordered"
            placeholder="Climb Type"
            value={form.climbType}
            onChange={(e) => setForm({ ...form, climbType: e.target.value })}
          />

          <input
            className="input input-bordered"
            placeholder="Grade (e.g. V4)"
            value={form.grade}
            onChange={(e) => setForm({ ...form, grade: e.target.value })}
          />

          <input
            className="input input-bordered"
            type="number"
            min="1"
            value={form.attempts}
            onChange={(e) =>
              setForm({ ...form, attempts: Number(e.target.value) || 1 })
            }
          />
        </div>

        <button className="btn btn-primary mt-6" onClick={addClimb}>
          Add Climb
        </button>
      </div>


      {/* TABLE OF CLIMBS */}
      <div className="card bg-base-100 p-8 shadow-xl">
        <h3 className="text-2xl font-semibold mb-6">Logged Climbs</h3>

        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Type</th>
                <th>Grade</th>
                <th>Attempts</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {climbs.map((c) => (
                <tr key={c._id}>
                  <td>{c.climbType}</td>
                  <td>{c.grade}</td>
                  <td>{c.attempts}</td>
                  <td className="space-x-2">
                    <button
                      className="btn btn-sm btn-outline"
                      onClick={() => {
                        setEditingClimb({ ...c });
                        setShowEditModal(true);
                      }}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-sm btn-error"
                      onClick={() => {
                        setEditingClimb({ ...c });
                        setShowDeleteModal(true);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>


      {/* ANALYTICS DASHBOARD */}
      <div className="card bg-base-100 p-8 shadow-xl space-y-10">
        <h3 className="text-2xl font-semibold mb-6">Analytics Dashboard</h3>

        {/* 1️⃣ Climbs Per Grade */}
        <div>
          <h4 className="text-xl font-bold mb-4">Climbs Per Grade</h4>

          {gradeChartData.length === 0 ? (
            <p>No climb data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={gradeChartData}>
                <XAxis dataKey="grade" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#4ADE80" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* 2️⃣ Climbs Per Type (Pie) */}
        <div>
          <h4 className="text-xl font-bold mb-4">Climbs Per Type</h4>

          {typeChartData.length === 0 ? (
            <p>No climb data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={typeChartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  fill="#60A5FA"
                  label
                />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* 3️⃣ Attempts Over Time (Line Chart) */}
        <div>
          <h4 className="text-xl font-bold mb-4">Attempts Over Time</h4>

          {attemptsOverTime.length === 0 ? (
            <p>No climb data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={attemptsOverTime}>
                <XAxis dataKey="index" label="Climb #" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="attempts"
                  stroke="#F472B6"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* 4️⃣ Attempts Distribution */}
        <div>
          <h4 className="text-xl font-bold mb-4">Attempts Distribution</h4>

          {attemptsDist.length === 0 ? (
            <p>No climb data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={attemptsDist}>
                <XAxis dataKey="attempts" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#FB923C" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>


      {/* EDIT MODAL */}
      {showEditModal && (
        <dialog open className="modal">
          <div className="modal-box space-y-4">
            <h3 className="text-xl font-semibold">Edit Climb</h3>

            <input
              className="input input-bordered w-full"
              value={editingClimb.climbType}
              onChange={(e) =>
                setEditingClimb({ ...editingClimb, climbType: e.target.value })
              }
            />

            <input
              className="input input-bordered w-full"
              value={editingClimb.grade}
              onChange={(e) =>
                setEditingClimb({ ...editingClimb, grade: e.target.value })
              }
            />

            <input
              className="input input-bordered w-full"
              type="number"
              value={editingClimb.attempts}
              onChange={(e) =>
                setEditingClimb({
                  ...editingClimb,
                  attempts: Number(e.target.value) || 1,
                })
              }
            />

            <div className="modal-action">
              <button className="btn btn-primary" onClick={handleEdit}>
                Save
              </button>
              <button className="btn" onClick={() => setShowEditModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </dialog>
      )}

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <dialog open className="modal">
          <div className="modal-box">
            <h3 className="text-xl font-bold">Confirm Delete</h3>
            <p className="py-4">Are you sure you want to delete this climb?</p>

            <div className="modal-action">
              <button className="btn btn-error" onClick={handleDelete}>
                Yes, delete it
              </button>
              <button className="btn" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </dialog>
      )}

    </div>
  );
}
