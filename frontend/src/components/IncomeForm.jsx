import { useState } from 'react';

function IncomeForm({ months }) {
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');

  function handleSubmit(e) {
    e.preventDefault();

    if (!months.length) {
      alert("Adicione ao menos um mês antes de incluir uma receita.");
      return;
    }

    const transaction = {
      type: "income",
      description,
      value: parseFloat(value),
      date: months[0], // para este exemplo: primeiro mês
    };

    const stored = JSON.parse(localStorage.getItem('transactions')) || [];
    localStorage.setItem('transactions', JSON.stringify([...stored, transaction]));

    setDescription('');
    setValue('');
  }

  return (
    <div>
      <h3>Incluir Receita</h3>
      <form onSubmit={handleSubmit}>
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

export default IncomeForm;
