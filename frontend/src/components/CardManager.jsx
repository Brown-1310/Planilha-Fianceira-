import { useState, useEffect } from 'react';

function CardManager() {
  const [cardName, setCardName] = useState('');
  const [cardLimit, setCardLimit] = useState('');
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('cards')) || [];
    setCards(saved);
  }, []);

  const handleAddCard = () => {
    if (!cardName || !cardLimit) return alert("Preencha nome e limite");

    const newCard = { name: cardName, limit: parseFloat(cardLimit), purchases: [] };
    const updated = [...cards, newCard];
    setCards(updated);
    localStorage.setItem('cards', JSON.stringify(updated));
    setCardName('');
    setCardLimit('');
  };

  return (
    <div>
      <h2>Gerenciar Cartões</h2>
      <input
        type="text"
        placeholder="Nome do cartão"
        value={cardName}
        onChange={(e) => setCardName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Limite"
        value={cardLimit}
        onChange={(e) => setCardLimit(e.target.value)}
      />
      <button onClick={handleAddCard}>Adicionar Cartão</button>

      <ul>
        {cards.map((card, idx) => (
          <li key={idx}>{card.name} — Limite: R$ {card.limit.toFixed(2).replace('.', ',')}</li>
        ))}
      </ul>
    </div>
  );
}

export default CardManager;
