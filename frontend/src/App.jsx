import { useState } from 'react';
import MonthSelector from './components/MonthSelector';
import IncomeForm from './components/IncomeForm';
import ExpenseForm from './components/ExpenseForm';
import FinanceTable from './components/FinanceTable';
import CardManager from './components/CardManager';
import CardPurchaseForm from './components/CardPurchaseForm';

function App() {
  // Inicializa com os próximos 12 meses
  const [months, setMonths] = useState(() => {
    const today = new Date();
    return Array.from({ length: 12 }, (_, i) => {
      const date = new Date(today.getFullYear(), today.getMonth() + i, 1);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    });
  });

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "20px" }}>
      <h1>💰 Controle Financeiro Pessoal</h1>

      {/* Seletor de Meses */}
      <MonthSelector months={months} setMonths={setMonths} />

      {/* Receita */}
      <section>
        <h2>Incluir Receita</h2>
        <IncomeForm months={months} />
      </section>

      {/* Despesa */}
      <section>
        <h2>Incluir Despesa</h2>
        <ExpenseForm months={months} />
      </section>

      {/* Tabela de Finanças */}
      <FinanceTable months={months} setMonths={setMonths} />

      <hr style={{ margin: "40px 0" }} />

      {/* Cartões */}
      <section>
        <h2>🧾 Controle de Cartões</h2>
        <CardManager />
        <CardPurchaseForm months={months} />
      </section>
    </div>
  );
}

export default App;
