import { useState } from 'react';
import MonthSelector from './components/MonthSelector';
import IncomeForm from './components/IncomeForm';
import ExpenseForm from './components/ExpenseForm';
import FinanceTable from './components/FinanceTable';
import CardManager from './components/CardManager';
import CardPurchaseForm from './components/CardPurchaseForm';

function App() {
  const [months, setMonths] = useState([]);

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
      <FinanceTable months={months} />

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
