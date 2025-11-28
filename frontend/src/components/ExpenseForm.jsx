import { useState } from 'react';

const initialState = {
  description: '',
  category: '',
  amount: '',
  occurredOn: '',
};

export default function ExpenseForm({ onSubmit }) {
  const [form, setForm] = useState(initialState);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setFeedback('');
    try {
      await onSubmit({
        ...form,
        amount: Number(form.amount),
      });
      setForm(initialState);
      setFeedback('Gasto cadastrado!');
    } catch (err) {
      setFeedback(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <article className="card">
      <h2>Novo gasto</h2>
      <form onSubmit={handleSubmit} className="form-grid">
        <label>
          Descrição
          <input
            type="text"
            value={form.description}
            onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
            required
          />
        </label>

        <label>
          Categoria
          <input
            type="text"
            value={form.category}
            placeholder="Mercado, Transporte..."
            onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
          />
        </label>

        <label>
          Valor
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.amount}
            onChange={(e) => setForm((prev) => ({ ...prev, amount: e.target.value }))}
            required
          />
        </label>

        <label>
          Data
          <input
            type="date"
            value={form.occurredOn}
            onChange={(e) => setForm((prev) => ({ ...prev, occurredOn: e.target.value }))}
          />
        </label>

        <button type="submit" className="primary-btn" disabled={saving}>
          {saving ? 'Salvando...' : 'Cadastrar gasto'}
        </button>
      </form>
      {feedback && <small className="helper-text">{feedback}</small>}
    </article>
  );
}



