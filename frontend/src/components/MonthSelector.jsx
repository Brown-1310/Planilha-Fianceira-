import { useState, useEffect } from 'react';

function MonthSelector({ months, setMonths }) {
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Carrega meses do localStorage na primeira renderização
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('months')) || [];
    setMonths(stored);
  }, []);

  // Atualiza localStorage sempre que os meses forem alterados
  useEffect(() => {
    localStorage.setItem('months', JSON.stringify(months));
  }, [months]);

  function handleAddMonth() {
    if (!selectedMonth) return;
    const newKey = `${selectedYear}-${selectedMonth}`;
    if (!months.includes(newKey)) {
      const updated = [...months, newKey].sort();
      setMonths(updated);
    }
  }

  function handleRemoveMonth() {
    const key = `${selectedYear}-${selectedMonth}`;
    const updated = months.filter((m) => m !== key);
    setMonths(updated);
  }

  return (
    <div>
      <h2>Gerenciar Meses</h2>
      <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
        <option value="">Mês</option>
        {[...Array(12)].map((_, i) => {
          const monthNum = String(i + 1).padStart(2, '0');
          return (
            <option key={monthNum} value={monthNum}>
              {monthNum}
            </option>
          );
        })}
      </select>

      <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
        {[...Array(10)].map((_, i) => {
          const year = new Date().getFullYear() + i;
          return <option key={year} value={year}>{year}</option>;
        })}
      </select>

      <button onClick={handleAddMonth}>Adicionar Mês</button>
      <button onClick={handleRemoveMonth}>Remover Mês</button>
    </div>
  );
}

export default MonthSelector;
