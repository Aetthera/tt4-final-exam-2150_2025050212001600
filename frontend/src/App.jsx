import { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [editId, setEditId] = useState(null);
  console.log("Current expenses:", expenses);
  const [form, setForm] = useState({
    description: "",
    amount: "",
    date: "",
    category: ""
  });

  useEffect(() => {
    fetch("http://localhost:5050/api/expenses")
      .then((res) => res.json())
      .then((data) => setExpenses(data))
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  
    const method = editId ? "PUT" : "POST";
    const url = editId
      ? `http://localhost:5050/api/expenses/${editId}`
      : "http://localhost:5050/api/expenses";
  
    fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed");
        return res.json();
      })
      .then((data) => {
        if (editId) {
          setExpenses((prev) =>
            prev.map((e) => (e.id === editId ? { ...form, id: editId } : e))
          );
        } else {
          setExpenses([...expenses, data]);
        }
        setForm({ description: "", amount: "", date: "", category: "" });
        setEditId(null);
      })
      .catch((err) => console.error(err));
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:5050/api/expenses/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.ok) {
          setExpenses(expenses.filter((expense) => expense.id !== id));
        } else {
          console.error("Failed to delete");
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="container py-4">
      <h1 className="text-center">Expense Tracker</h1>

      <form className="mb-4" onSubmit={handleSubmit}>
        <div className="row g-2">
          <div className="col-md-3">
            <input
              className="form-control"
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-2">
            <input
              className="form-control"
              name="amount"
              type="number"
              placeholder="Amount"
              value={form.amount}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-3">
            <input
              className="form-control"
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-2">
            <input
              className="form-control"
              name="category"
              placeholder="Category"
              value={form.category}
              onChange={handleChange}
              required
            />
          </div>
          <div className="col-md-2">
            <button className="btn btn-primary w-100" type="submit">
              Add
            </button>
          </div>
        </div>
      </form>

      <ul className="list-group">
      {expenses.map((expense) => (
        <li key={expense.id} className="list-group-item d-flex justify-content-between align-items-center">
          <span>
            {expense.description} — ${expense.amount} — {expense.date} — {expense.category}
          </span>
          <div>
            <button className="btn btn-sm btn-secondary me-2" onClick={() => {
              setForm(expense);
              setEditId(expense.id);
            }}>Edit</button>
            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(expense.id)}>Delete</button>
          </div>
        </li>
        ))}
      </ul>
    </div>
  );
}

export default App;