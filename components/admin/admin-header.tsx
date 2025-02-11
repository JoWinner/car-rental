"use client"
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, ArrowLeft } from 'lucide-react';

interface AdminHeaderProps {
  title: string;
  description: string;
  action?: {
    label: string;
    href: string;
  };
}


export function AdminHeader({ title, description, action }: AdminHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between  ">
      <div className='my-16 md:my-4 '>
      <Button variant="outline" onClick={() => router.back()} className='mb-1'>
          <ArrowLeft className="mr-2 h-4 w-4 " />
          Go Back

        </Button>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      {action && (
        <Button asChild>
          <Link href={action.href}>
            <Plus className="mr-2 h-4 w-4" />
            {action.label}
          </Link>
        </Button>
      )}
    </div>
  );
}
