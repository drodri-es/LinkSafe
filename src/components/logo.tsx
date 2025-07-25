import { Leaf } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn('flex items-center gap-2 text-primary', className)}>
      <Leaf className="h-7 w-7" />
      <span className="text-2xl font-bold tracking-tighter">LinkSafe</span>
    </Link>
  );
}
