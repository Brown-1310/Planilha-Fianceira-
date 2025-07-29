import { useState } from "react";

function ExpenseForm({ months }) {
  const [description, setDescription] = useState("");
  const [subtype, setSubtype] = useState("fixa");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!description || !subtype) return;

    const transactions = JSON.parse(localStorage.getItem("transactions")) || [];

    months.forEach((month) => {
      transactions.push({
        type: "expense",
        subtype,
        description,
        value: 0,
        date: new Date(`${month}-01`).toISOString(),
      });
    });

    localStorage.setItem("transactions", JSON.stringify(transactions));
    setDescription("");
    setSubtype("fixa");
    window.location.reload();
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
      {/* <h2>Incluir Despesa</h2> foi removido */}
      <select value={subtype} onChange={(e) => setSubtype(e.target.value)} required>
        <option value="fixa">Fixa</option>
        <option value="variavel">Variável</option>
        <option value="previsao">Previsão</option>
      </select>
      <input
        type="text"
        placeholder="Descrição da despesa"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <button type="submit">Incluir</button>
    </form>
  );
}

export default ExpenseForm;
