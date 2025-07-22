'use client';

import { Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

type SidebarContentProps = {
  allTags: string[];
  selectedTags: string[];
  setSelectedTags: (tags: string[]) => void;
};

export function SidebarContent({ allTags, selectedTags, setSelectedTags }: SidebarContentProps) {
  const toggleTag = (tag: string) => {
    setSelectedTags(
      selectedTags.includes(tag)
        ? selectedTags.filter((t) => t !== tag)
        : [...selectedTags, tag]
    );
  };

  return (
    <div className="p-4">
      <Card>
        <CardHeader className="p-4">
          <CardTitle className="flex items-center gap-2 text-base">
            <Tag className="h-4 w-4" />
            Filter by Tags
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          {allTags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTags.includes(tag) ? 'default' : 'secondary'}
                  className="cursor-pointer transition-all hover:scale-105"
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No tags yet. Add tags to your bookmarks to filter them here.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
