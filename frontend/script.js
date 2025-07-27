// URL base da sua API (ajuste se necessário)
const API_URL = "http://localhost:3000/api/transactions";

// Formulário de entrada (salário, etc.)
const incomeForm = document.getElementById("income-form");
incomeForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(incomeForm);
  const data = {
    type: "income",
    description: formData.get("description"),
    value: parseFloat(formData.get("value")),
    date: new Date().toISOString(),
  };

  await sendTransaction(data);
  incomeForm.reset();
});

// Formulário de despesas
const expenseForm = document.getElementById("expense-form");
expenseForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(expenseForm);
  const data = {
    type: "expense",
    subtype: formData.get("subtype"), // fixa, variável ou previsão
    description: formData.get("description"),
    value: parseFloat(formData.get("value")),
    date: new Date().toISOString(),
  };

  await sendTransaction(data);
  expenseForm.reset();
});

// Envia transação para a API
async function sendTransaction(data) {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) throw new Error("Erro ao enviar transação.");
    alert("Transação salva com sucesso!");
  } catch (err) {
    console.error(err);
    alert("Erro ao salvar a transação.");
  }
}

