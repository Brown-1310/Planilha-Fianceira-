import { useState } from 'react';

function ExpenseForm({ months }) {
  const [subtype, setSubtype] = useState('');
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');

  function handleSubmit(e) {
    e.preventDefault();

    if (!months.length) {
      alert("Adicione ao menos um mês antes de incluir uma despesa.");
      return;
    }

    const transaction = {
      type: "expense",
      subtype,
      description,
      value: parseFloat(value),
      date: months[0], // para este exemplo: primeiro mês
    };

    const stored = JSON.parse(localStorage.getItem('transactions')) || [];
    localStorage.setItem('transactions', JSON.stringify([...stored, transaction]));

    setSubtype('');
    setDescription('');
    setValue('');
  }

  return (
    <div>
      <h3>Incluir Despesa</h3>
      <form onSubmit={handleSubmit}>
        <select value={subtype} onChange={(e) => setSubtype(e.target.value)} required>
          <option value="">Tipo de Despesa</option>
          <option value="fixa">Fixa</option>
          <option value="variavel">Variável</option>
          <option value="previsao">Previsão</option>
        </select>
        <input
          type="text"
          placeholder="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Valor"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          required
        />
        <button type="submit">Incluir</button>
      </form>
    </div>
  );
}

export default ExpenseForm;
