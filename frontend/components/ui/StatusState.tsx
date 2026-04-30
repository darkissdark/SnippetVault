export function StatusState({
  variant,
  message,
}: {
  variant: 'loading' | 'empty' | 'error';
  message: string;
}) {
  const className =
    variant === 'error'
      ? 'rounded-lg border border-red-200 bg-red-50 p-4 text-red-700'
      : 'rounded-lg border border-slate-200 bg-white p-4 text-slate-700';

  return (
    <div className={className} role={variant === 'error' ? 'alert' : 'status'}>
      {message}
    </div>
  );
}
