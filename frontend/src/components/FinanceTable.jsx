import { useEffect, useState } from "react";

function FinanceTable({ months, setMonths }) {
  const [grouped, setGrouped] = useState({});
  const [totalFaturaPorMes, setTotalFaturaPorMes] = useState({});

  useEffect(() => {
    if (months.length === 0) {
      const today = new Date();
      const initialMonths = Array.from({ length: 12 }, (_, i) => {
        const date = new Date(today.getFullYear(), today.getMonth() + i, 1);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      });
      setMonths(initialMonths);
    }
  }, [months, setMonths]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("transactions")) || [];
    const groupedData = {};
    const faturas = {};

    stored.forEach((t) => {
      const date = new Date(t.date);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

      if (!groupedData[key])
        groupedData[key] = {
          Receitas: [],
          "Despesas Fixas": [],
          "Despesas Variáveis": [],
          Previsões: [],
          Cartao: []
        };

      if (t.type === "income") {
        groupedData[key].Receitas.push({ ...t });
      } else if (t.type === "expense") {
        const map = {
          fixa: "Despesas Fixas",
          variavel: "Despesas Variáveis",
          previsao: "Previsões",
          cartao: "Cartao"
        };
        const cat = map[t.subtype];
        if (cat) groupedData[key][cat].push({ ...t });

        if (t.subtype === "cartao") {
          faturas[key] = (faturas[key] || 0) + t.value;
        }
      }
    });

    setGrouped(groupedData);
    setTotalFaturaPorMes(faturas);
  }, [months]);

  function getMonthName(m) {
    const nomes = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    return nomes[parseInt(m, 10) - 1];
  }

  if (months.length === 0) return null;

  const categorias = ["Receitas", "Despesas Fixas", "Despesas Variáveis", "Previsões", "Cartao"];

  function handleDeleteRow(cat, desc) {
    const stored = JSON.parse(localStorage.getItem("transactions")) || [];
    const filtered = stored.filter((t) => !(t.description === desc && (
      (cat === "Receitas" && t.type === "income") ||
      (t.type === "expense" && grouped[t.date.slice(0, 7)]?.[cat]?.some(tt => tt.description === desc))
    )));
    localStorage.setItem("transactions", JSON.stringify(filtered));
    window.location.reload();
  }

  return (
    <div style={{ overflowX: "auto", marginTop: "30px" }}>
      <table border="1" style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th>Categoria / Descrição</th>
            {months.map((month) => {
              const [year, m] = month.split("-");
              return <th key={month}>{`${getMonthName(m)}/${year}`}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {categorias.map((cat) => {
            const descricoes = new Set();
            months.forEach((month) => {
              grouped[month]?.[cat]?.forEach((t) => descricoes.add(t.description));
            });

            const rows = Array.from(descricoes).map((desc) => (
              <tr key={`${cat}-${desc}`}>
                <td>
                  {`${cat} - ${desc}`} <button onClick={() => handleDeleteRow(cat, desc)}>🗑</button>
                </td>
                {months.map((month) => {
                  const item = grouped[month]?.[cat]?.find((t) => t.description === desc);

                  const handleChange = (e) => {
                    const value = parseFloat(e.target.value);
                    if (isNaN(value)) return;

                    const updated = JSON.parse(localStorage.getItem("transactions")) || [];

                    for (let i = 0; i < months.length; i++) {
                      const mth = months[i];
                      const index = updated.findIndex((t) =>
                        t.date.startsWith(mth) &&
                        t.description === desc &&
                        ((cat === "Receitas" && t.type === "income") ||
                          (t.type === "expense" && grouped[mth]?.[cat]?.some(tt => tt.description === desc)))
                      );
                      if (index !== -1) {
                        updated[index].value = value;
                      }
                    }

                    localStorage.setItem("transactions", JSON.stringify(updated));
                    window.location.reload();
                  };

                  return (
                    <td key={month} style={{ textAlign: "right" }}>
                      <input
                        type="number"
                        step="0.01"
                        defaultValue={item ? item.value : ""}
                        onBlur={handleChange}
                        style={{ width: "80px" }}
                      />
                    </td>
                  );
                })}
              </tr>
            ));

            const subtotal = (
              <tr key={`subtotal-${cat}`} style={{ fontWeight: "bold" }}>
                <td>Subtotal {cat}</td>
                {months.map((month) => {
                  const soma = grouped[month]?.[cat]?.reduce((sum, t) => sum + t.value, 0) || 0;
                  return <td key={month}>{soma.toFixed(2).replace(".", ",")}</td>;
                })}
              </tr>
            );

            return [rows, subtotal];
          })}

          <tr>
            <td><b>Total de Receitas</b></td>
            {months.map((month) => {
              const total = grouped[month]?.["Receitas"]?.reduce((sum, t) => sum + t.value, 0) || 0;
              return <td key={month}>{total.toFixed(2).replace(".", ",")}</td>;
            })}
          </tr>
          <tr>
            <td><b>Total de Despesas</b></td>
            {months.map((month) => {
              const total = ["Despesas Fixas", "Despesas Variáveis", "Previsões"].reduce((acc, tipo) => {
                return acc + (grouped[month]?.[tipo]?.reduce((s, t) => s + t.value, 0) || 0);
              }, 0);
              return <td key={month}>{total.toFixed(2).replace(".", ",")}</td>;
            })}
          </tr>
          <tr>
            <td><b>Total Cartão</b></td>
            {months.map((month) => {
              const total = totalFaturaPorMes[month] || 0;
              return <td key={month}>{total.toFixed(2).replace(".", ",")}</td>;
            })}
          </tr>
          <tr>
            <td><b>Saldo do Mês</b></td>
            {months.map((month) => {
              const receitas = grouped[month]?.["Receitas"]?.reduce((s, t) => s + t.value, 0) || 0;
              const despesas = ["Despesas Fixas", "Despesas Variáveis", "Previsões"].reduce((acc, tipo) => {
                return acc + (grouped[month]?.[tipo]?.reduce((s, t) => s + t.value, 0) || 0);
              }, 0);
              const cartao = totalFaturaPorMes[month] || 0;
              return <td key={month}>{(receitas - despesas - cartao).toFixed(2).replace(".", ",")}</td>;
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default FinanceTable;
