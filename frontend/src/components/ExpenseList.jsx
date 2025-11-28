import dayjs from 'dayjs';

export default function ExpenseList({ expenses = [], loading }) {
  return (
    <section className="card">
      <div className="card__header">
        <h2>Gastos recentes</h2>
        <span>{expenses.length} registro(s)</span>
      </div>

      {loading ? (
        <p>Carregando...</p>
      ) : expenses.length === 0 ? (
        <p>Nenhum gasto cadastrado até o momento.</p>
      ) : (
        <ul className="expense-list">
          {expenses.map((expense) => (
            <li key={expense.id}>
              <div>
                <strong>{expense.description}</strong>
                <span>: {expense.category}</span>
              </div>
              <div className="expense-list__meta">
                <span>{dayjs(expense.occurred_on).format('DD/MM/YYYY')}</span>
                <strong>R$ {Number(expense.amount).toFixed(2)}</strong>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}


