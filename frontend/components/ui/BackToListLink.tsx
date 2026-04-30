import Link from 'next/link';

type BackToListLinkProps = {
  className?: string;
};

export function BackToListLink({ className }: BackToListLinkProps) {
  return (
    <Link
      href="/"
      className={
        className ?? 'inline-block text-sm text-slate-600 hover:underline'
      }
    >
      Back to list
    </Link>
  );
}
