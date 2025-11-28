import { useEffect, useState } from 'react';

export default function SalaryCard({ salary, onSubmit, loading }) {
  const [amount, setAmount] = useState(salary?.amount ?? '');
  const [referenceMonth, setReferenceMonth] = useState(salary?.reference_month ?? '');
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    setAmount(salary?.amount ?? '');
    setReferenceMonth(salary?.reference_month ?? '');
  }, [salary]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setFeedback('');
    try {
      await onSubmit({ amount: Number(amount), referenceMonth });
      setFeedback('Salário atualizado com sucesso!');
    } catch (err) {
      setFeedback(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <article className="card">
      <h2>Salário mensal</h2>
      <form onSubmit={handleSubmit} className="form-inline">
        <label>
          Valor
          <input
            type="number"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={loading}
            required
          />
        </label>

        <label>
          Referência
          <input
            type="text"
            placeholder="Nov/2025"
            value={referenceMonth}
            onChange={(e) => setReferenceMonth(e.target.value)}
            disabled={loading}
          />
        </label>

        <button type="submit" className="primary-btn" disabled={saving || loading}>
          {saving ? 'Salvando...' : 'Salvar salário'}
        </button>
      </form>
      {feedback && <small className="helper-text">{feedback}</small>}
    </article>
  );
}

