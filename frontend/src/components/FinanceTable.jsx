import { useEffect, useState } from 'react';

function FinanceTable({ months }) {
  const [grouped, setGrouped] = useState({});

  useEffect(() => {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    const result = {};

    months.forEach((month) => {
      result[month] = {
        Receitas: [],
        'Despesas Fixas': [],
        'Despesas Variáveis': [],
        Previsões: []
      };
    });

    transactions.forEach((t) => {
      const date = new Date(t.date);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!months.includes(key)) return;

      if (t.type === 'income') {
        result[key].Receitas.push(t);
      } else if (t.type === 'expense') {
        const map = {
          fixa: 'Despesas Fixas',
          variavel: 'Despesas Variáveis',
          previsao: 'Previsões'
        };
        const cat = map[t.subtype];
        if (cat) result[key][cat].push(t);
      }
    });

    setGrouped(result);
  }, [months]);

  function getMonthName(m) {
    const nomes = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    return nomes[parseInt(m, 10) - 1];
  }

  if (months.length === 0) return null;

  const categorias = ['Receitas', 'Despesas Fixas', 'Despesas Variáveis', 'Previsões'];

  return (
    <div>
      <h3>Tabela Financeira</h3>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Categoria / Descrição</th>
            {months.map((month) => {
              const [year, m] = month.split('-');
              return <th key={month}>{getMonthName(m)}/{year}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {categorias.map((cat) => {
            const descricoes = new Set();
            months.forEach((month) => {
              grouped[month]?.[cat]?.forEach((t) => descricoes.add(t.description));
            });

            return (
              <>
                {[...descricoes].map((desc) => (
                  <tr key={`${cat}-${desc}`}>
                    <td>{cat} - {desc}</td>
                    {months.map((month) => {
                      const item = grouped[month]?.[cat]?.find((t) => t.description === desc);
                      return <td key={month}>{item ? item.value.toFixed(2).replace('.', ',') : '-'}</td>;
                    })}
                  </tr>
                ))}
                <tr>
                  <td><b>Subtotal {cat}</b></td>
                  {months.map((month) => {
                    const sum = grouped[month]?.[cat]?.reduce((acc, t) => acc + t.value, 0) || 0;
                    return <td key={month}><b>{sum.toFixed(2).replace('.', ',')}</b></td>;
                  })}
                </tr>
              </>
            );
          })}

          {/* Totais finais */}
          <tr>
            <td><b>Total de Receitas</b></td>
            {months.map((month) => {
              const total = grouped[month]?.Receitas?.reduce((acc, t) => acc + t.value, 0) || 0;
              return <td key={month}><b>{total.toFixed(2).replace('.', ',')}</b></td>;
            })}
          </tr>
          <tr>
            <td><b>Total de Despesas</b></td>
            {months.map((month) => {
              const total = ['Despesas Fixas', 'Despesas Variáveis', 'Previsões'].reduce((acc, cat) => {
                return acc + (grouped[month]?.[cat]?.reduce((s, t) => s + t.value, 0) || 0);
              }, 0);
              return <td key={month}><b>{total.toFixed(2).replace('.', ',')}</b></td>;
            })}
          </tr>
          <tr>
            <td><b>Saldo do Mês</b></td>
            {months.map((month) => {
              const r = grouped[month]?.Receitas?.reduce((acc, t) => acc + t.value, 0) || 0;
              const d = ['Despesas Fixas', 'Despesas Variáveis', 'Previsões'].reduce((acc, cat) => {
                return acc + (grouped[month]?.[cat]?.reduce((s, t) => s + t.value, 0) || 0);
              }, 0);
              const saldo = r - d;
              return <td key={month}><b>{saldo.toFixed(2).replace('.', ',')}</b></td>;
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default FinanceTable;
