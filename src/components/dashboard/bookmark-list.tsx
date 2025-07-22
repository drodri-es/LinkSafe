'use client';

import { BookmarkCard } from './bookmark-card';
import type { Bookmark } from '@/lib/types';
import { Button } from '../ui/button';
import { FilePlus2 } from 'lucide-react';

type BookmarkListProps = {
  bookmarks: Bookmark[];
  onEdit: (bookmark: Bookmark) => void;
  onDelete: (id: string) => void;
  openAddDialog: () => void;
};

export function BookmarkList({ bookmarks, onEdit, onDelete, openAddDialog }: BookmarkListProps) {
  if (bookmarks.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center rounded-lg border-2 border-dashed border-border bg-card/50 p-8 text-center">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">No bookmarks found</h2>
          <p className="mt-2 text-muted-foreground">
            It looks like you haven&apos;t added any bookmarks yet, or none match your current filters.
          </p>
          <Button className="mt-6" onClick={openAddDialog}>
            <FilePlus2 className="mr-2 h-4 w-4" />
            Add Your First Bookmark
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {bookmarks.map((bookmark) => (
        <BookmarkCard key={bookmark.id} bookmark={bookmark} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}
