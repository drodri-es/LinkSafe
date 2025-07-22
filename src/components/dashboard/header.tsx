'use client';

import { Plus, Search, User as UserIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AddBookmarkDialog } from '@/components/dashboard/add-bookmark-dialog';
import { Logo } from '@/components/logo';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/use-auth';
import type { Bookmark } from '@/lib/types';

type HeaderProps = {
  onAddBookmark: (bookmark: Omit<Bookmark, 'id' | 'createdAt'>) => void;
  setSearchText: (text: string) => void;
};

export function Header({ onAddBookmark, setSearchText }: HeaderProps) {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>
      <div className="hidden md:block">
        <Logo />
      </div>
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <form className="ml-auto flex-1 sm:flex-initial">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search bookmarks..."
              className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
        </form>
        <AddBookmarkDialog onSave={onAddBookmark} mode="add">
          <Button className="shrink-0">
            <Plus className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Add Bookmark</span>
          </Button>
        </AddBookmarkDialog>
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <UserIcon className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{user?.name || 'My Account'}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
