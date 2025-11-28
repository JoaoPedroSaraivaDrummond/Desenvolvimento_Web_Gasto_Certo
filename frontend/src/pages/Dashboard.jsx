import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiRequest } from '../api/client';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import SalaryCard from '../components/SalaryCard';
import SummaryCard from '../components/SummaryCard';

export default function DashboardPage() {
  const { user, token, logout } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const data = await apiRequest('/api/finance/summary', { token });
      setSummary(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
    
  }, []);

  const handleSalarySave = async (payload) => {
    await apiRequest('/api/finance/salary', {
      method: 'POST',
      body: payload,
      token,
    });
    await fetchSummary();
  };

  const handleExpenseSubmit = async (payload) => {
    await apiRequest('/api/finance/expenses', {
      method: 'POST',
      body: payload,
      token,
    });
    await fetchSummary();
  };

  return (
    <div className="dashboard">
      <header className="dashboard__topbar">
        <div>
          <h1>Oi, {user?.name || 'usuário'}</h1>
          <p>Organize seus gastos e saiba quanto ainda pode usar.</p>
        </div>
        <button type="button" className="secondary-btn" onClick={logout}>
          Sair
        </button>
      </header>

      {error && <p className="form-error">{error}</p>}

      <section className="dashboard__grid">
        <SummaryCard summary={summary} loading={loading} />
        <SalaryCard
          salary={summary?.salary}
          onSubmit={handleSalarySave}
          loading={loading}
        />
        <ExpenseForm onSubmit={handleExpenseSubmit} />
      </section>

      <ExpenseList expenses={summary?.expenses || []} loading={loading} />
    </div>
  );
}


