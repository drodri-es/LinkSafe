'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth.tsx';
import { mockBookmarks } from '@/lib/data';
import type { Bookmark } from '@/lib/types';
import { AddBookmarkDialog } from './add-bookmark-dialog';
import { BookmarkList } from './bookmark-list';
import { Header } from './header';
import { SidebarContent } from './sidebar-content';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sidebar,
  SidebarContent as SidebarUiContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import { useToast } from '@/hooks/use-toast';
import { Logo } from '../logo';

export function MainDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [searchText, setSearchText] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<'date-desc' | 'date-asc' | 'title-asc' | 'title-desc'>(
    'date-desc'
  );

  const [editingBookmark, setEditingBookmark] = useState<Bookmark | undefined>(undefined);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    // In a real app, you would fetch bookmarks from Firestore here.
    // For now, we sort the mock data by date descending on initial load.
    const sortedMockData = [...mockBookmarks].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    setBookmarks(sortedMockData);
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);
  
  useEffect(() => {
    if (!isEditDialogOpen) {
      setEditingBookmark(undefined);
    }
  }, [isEditDialogOpen]);

  const handleAddBookmark = (newBookmarkData: Omit<Bookmark, 'id' | 'createdAt'>) => {
    const newBookmark: Bookmark = {
      ...newBookmarkData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setBookmarks((prev) => [newBookmark, ...prev]);
  };

  const handleEditBookmark = (updatedBookmarkData: Omit<Bookmark, 'id' | 'createdAt'>, id: string) => {
    setBookmarks((prev) =>
      prev.map((bm) =>
        bm.id === id ? { ...bm, ...updatedBookmarkData, id: bm.id, createdAt: bm.createdAt } : bm
      )
    );
    setEditingBookmark(undefined);
  };
  
  const openEditDialog = (bookmark: Bookmark) => {
    setEditingBookmark(bookmark);
    setIsEditDialogOpen(true);
  };

  const handleDeleteBookmark = (id: string) => {
    setBookmarks((prev) => prev.filter((bm) => bm.id !== id));
    toast({
      title: 'Bookmark Deleted',
      description: 'The bookmark has been removed from your list.',
    });
  };

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    bookmarks.forEach((bm) => bm.tags.forEach((tag) => tags.add(tag)));
    return Array.from(tags).sort();
  }, [bookmarks]);

  const filteredBookmarks = useMemo(() => {
    return bookmarks
      .filter((bm) => {
        const searchLower = searchText.toLowerCase();
        const matchesSearch =
          bm.title.toLowerCase().includes(searchLower) ||
          bm.url.toLowerCase().includes(searchLower) ||
          (bm.description && bm.description.toLowerCase().includes(searchLower));

        const matchesTags =
          selectedTags.length === 0 || selectedTags.every((tag) => bm.tags.includes(tag));

        return matchesSearch && matchesTags;
      })
      .sort((a, b) => {
        switch (sortOrder) {
          case 'date-asc':
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          case 'title-asc':
            return a.title.localeCompare(b.title);
          case 'title-desc':
            return b.title.localeCompare(a.title);
          case 'date-desc':
          default:
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
      });
  }, [bookmarks, searchText, selectedTags, sortOrder]);

  const openAddDialog = () => {
    setIsAddDialogOpen(true);
  };

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Logo className="animate-pulse" />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarUiContent>
          <SidebarContent allTags={allTags} selectedTags={selectedTags} setSelectedTags={setSelectedTags} />
        </SidebarUiContent>
      </Sidebar>
      <SidebarInset>
        <Header onAddBookmark={handleAddBookmark} setSearchText={setSearchText} openAddDialog={openAddDialog} />
        <main className="flex-1 p-4 md:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Your Bookmarks</h1>
            <div className="w-[180px]">
              <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-desc">Newest First</SelectItem>
                  <SelectItem value="date-asc">Oldest First</SelectItem>
                  <SelectItem value="title-asc">Title (A-Z)</SelectItem>
                  <SelectItem value="title-desc">Title (Z-A)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <BookmarkList
            bookmarks={filteredBookmarks}
            onEdit={openEditDialog}
            onDelete={handleDeleteBookmark}
            openAddDialog={openAddDialog}
          />
        </main>
      </SidebarInset>

      <AddBookmarkDialog 
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSave={handleAddBookmark}
        mode="add"
      >
        {/* This dialog is controlled programmatically from the header */}
        <div style={{ display: 'none' }} />
      </AddBookmarkDialog>

      {editingBookmark && (
        <AddBookmarkDialog
          key={editingBookmark.id}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          bookmark={editingBookmark}
          onSave={(data, id) => handleEditBookmark(data, id!)}
          mode="edit"
        >
          {/* This dialog is controlled programmatically */}
          <div style={{ display: 'none' }} />
        </AddBookmarkDialog>
      )}
    </SidebarProvider>
  );
}
