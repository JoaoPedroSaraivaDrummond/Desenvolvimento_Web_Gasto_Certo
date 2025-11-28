export default function SummaryCard({ summary, loading }) {
  const salary = summary?.salary?.amount ?? 0;
  const totalExpenses = summary?.totalExpenses ?? 0;
  const remaining = summary?.remaining ?? salary;

  return (
    <article className="card summary-card">
      <h2>Resumo</h2>
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div className="summary-grid">
          <div>
            <span>Salário</span>
            <strong>R$ {Number(salary).toFixed(2)}</strong>
          </div>
          <div>
            <span>Gastos</span>
            <strong>R$ {Number(totalExpenses).toFixed(2)}</strong>
          </div>
          <div>
            <span>Disponível</span>
            <strong className={remaining < 0 ? 'text-danger' : 'text-success'}>
              R$ {Number(remaining).toFixed(2)}
            </strong>
          </div>
        </div>
      )}
    </article>
  );
}



