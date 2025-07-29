import { useState } from "react";

function IncomeForm({ months }) {
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!description) return;

    const transactions = JSON.parse(localStorage.getItem("transactions")) || [];

    months.forEach((month) => {
      transactions.push({
        type: "income",
        description,
        value: 0,
        date: new Date(`${month}-01`).toISOString(),
      });
    });

    localStorage.setItem("transactions", JSON.stringify(transactions));
    setDescription("");
    window.location.reload();
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
      {/* <h2>Incluir Receita</h2> foi removido */}
      <input
        type="text"
        placeholder="Descrição da receita"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <button type="submit">Incluir</button>
    </form>
  );
}

export default IncomeForm;
