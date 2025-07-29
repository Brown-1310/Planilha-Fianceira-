import { useState, useEffect } from 'react';

function CardPurchaseForm({ months }) {
  const [cards, setCards] = useState([]);
  const [form, setForm] = useState({
    card: '',
    description: '',
    type: 'avista',
    installments: 1,
    value: '',
    month: months[0] || ''
  });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('cards')) || [];
    setCards(saved);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddPurchase = () => {
    const updatedCards = cards.map((card) => {
      if (card.name === form.card) {
        const purchase = {
          description: form.description,
          type: form.type,
          value: parseFloat(form.value),
          installments: form.type === 'parcelado' ? parseInt(form.installments) : 1,
          month: form.month
        };
        return { ...card, purchases: [...card.purchases, purchase] };
      }
      return card;
    });

    setCards(updatedCards);
    localStorage.setItem('cards', JSON.stringify(updatedCards));
    alert("Compra adicionada!");
    setForm({ ...form, description: '', value: '' });
  };

  return (
    <div>
      <h2>Lançar Compra no Cartão</h2>
      <select name="card" value={form.card} onChange={handleChange}>
        <option value="">Selecione o cartão</option>
        {cards.map((c, i) => <option key={i} value={c.name}>{c.name}</option>)}
      </select>
      <input name="description" type="text" placeholder="Descrição" value={form.description} onChange={handleChange} />
      <input name="value" type="number" placeholder="Valor" value={form.value} onChange={handleChange} />
      <select name="type" value={form.type} onChange={handleChange}>
        <option value="avista">À vista</option>
        <option value="parcelado">Parcelado</option>
      </select>
      {form.type === 'parcelado' && (
        <input name="installments" type="number" min="1" max="12" value={form.installments} onChange={handleChange} />
      )}
      <select name="month" value={form.month} onChange={handleChange}>
        {months.map((m) => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>
      <button onClick={handleAddPurchase}>Adicionar Compra</button>
    </div>
  );
}

export default CardPurchaseForm;
