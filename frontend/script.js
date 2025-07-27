document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "http://localhost:3000/api/transactions";
  let activeMonths = [];

  const rowLabels = [
    "Receitas",
    "Despesas Fixas",
    "Despesas Variáveis",
    "Previsões",
    "Subtotal Despesas Fixas",
    "Subtotal Despesas Variáveis",
    "Subtotal Previsões",
    "Total de Despesas",
    "Total de Receitas",
    "Saldo do Mês",
  ];

  window.addMonth = function () {
    const month = document.getElementById("select-month").value;
    const year = document.getElementById("select-year").value;
    const input = `${year}-${month}`;

    if (input && !activeMonths.includes(input)) {
      activeMonths.push(input);
      activeMonths.sort();
      loadAndRenderTable();
    }
  };

  window.removeMonth = function () {
    const month = document.getElementById("select-month").value;
    const year = document.getElementById("select-year").value;
    const input = `${year}-${month}`;

    activeMonths = activeMonths.filter(m => m !== input);
    loadAndRenderTable();
  };

  async function loadAndRenderTable() {
    try {
      const res = await fetch(API_URL);
      const transactions = await res.json();
      const grouped = groupTransactions(transactions);
      renderTable(grouped);
    } catch (err) {
      console.error("Erro ao buscar transações da API", err);
      alert("Erro ao carregar dados da API");
    }
  }

  function groupTransactions(transactions) {
    const grouped = {};

    transactions.forEach((t) => {
      const date = new Date(t.date);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

      if (!grouped[key]) grouped[key] = {
        "Receitas": 0,
        "Despesas Fixas": 0,
        "Despesas Variáveis": 0,
        "Previsões": 0
      };

      if (t.type === "income") {
        grouped[key]["Receitas"] += t.value;
      } else if (t.type === "expense") {
        const map = {
          fixa: "Despesas Fixas",
          variavel: "Despesas Variáveis",
          previsao: "Previsões"
        };
        const cat = map[t.subtype] || "Outros";
        grouped[key][cat] += t.value;
      }
    });

    return grouped;
  }

  function renderTable(grouped) {
    const container = document.getElementById("table-container");
    container.innerHTML = "";

    const table = document.createElement("table");
    table.border = "1";

    const thead = document.createElement("thead");
    const headRow = document.createElement("tr");
    const thMain = document.createElement("th");
    thMain.innerText = "Categoria";
    headRow.appendChild(thMain);

    activeMonths.forEach((month) => {
      const [year, m] = month.split("-");
      const th = document.createElement("th");
      th.innerText = `${getMonthName(m)}/${year}`;
      headRow.appendChild(th);
    });

    thead.appendChild(headRow);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");

    rowLabels.forEach((label) => {
      const row = document.createElement("tr");
      const tdLabel = document.createElement("td");
      tdLabel.innerText = label;
      row.appendChild(tdLabel);

      activeMonths.forEach((month) => {
        let val = 0;

        if (["Subtotal Despesas Fixas", "Subtotal Despesas Variáveis", "Subtotal Previsões"].includes(label)) {
          const map = {
            "Subtotal Despesas Fixas": "Despesas Fixas",
            "Subtotal Despesas Variáveis": "Despesas Variáveis",
            "Subtotal Previsões": "Previsões",
          };
          val = grouped[month]?.[map[label]] || 0;
        } else if (label === "Total de Despesas") {
          val =
            (grouped[month]?.["Despesas Fixas"] || 0) +
            (grouped[month]?.["Despesas Variáveis"] || 0) +
            (grouped[month]?.["Previsões"] || 0);
        } else if (label === "Total de Receitas") {
          val = grouped[month]?.["Receitas"] || 0;
        } else if (label === "Saldo do Mês") {
          const r = grouped[month]?.["Receitas"] || 0;
          const d =
            (grouped[month]?.["Despesas Fixas"] || 0) +
            (grouped[month]?.["Despesas Variáveis"] || 0) +
            (grouped[month]?.["Previsões"] || 0);
          val = r - d;
        } else {
          val = grouped[month]?.[label] || 0;
        }

        const td = document.createElement("td");
        td.innerText = val.toFixed(2).replace(".", ",");
        row.appendChild(td);
      });

      tbody.appendChild(row);
    });

    table.appendChild(tbody);
    container.appendChild(table);
  }

  function getMonthName(m) {
    const nomes = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    return nomes[parseInt(m, 10) - 1];
  }

  loadAndRenderTable();
});
