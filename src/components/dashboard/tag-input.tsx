'use client';

import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import React, { useCallback, useRef, useState } from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

type TagInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> & {
  value: string[];
  onChange: (tags: string[]) => void;
  allTags: string[];
};

export function TagInput({ value: tags, onChange, allTags, placeholder, ...props }: TagInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handleAddTag = useCallback(
    (tag: string) => {
      const newTag = tag.trim();
      if (newTag && !tags.includes(newTag)) {
        onChange([...tags, newTag]);
      }
      setInputValue('');
      setOpen(false);
      inputRef.current?.focus();
    },
    [tags, onChange]
  );

  const handleRemoveTag = (tagToRemove: string) => {
    onChange(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const input = inputRef.current;
    if (!input) return;

    if (e.key === 'Enter' && input.value) {
      e.preventDefault();
      handleAddTag(input.value);
    }
    if (e.key === 'Backspace' && input.value === '') {
      e.preventDefault();
      handleRemoveTag(tags[tags.length - 1]);
    }
    if (e.key === 'Escape') {
      input.blur();
    }
  };

  const filteredSuggestions = allTags.filter(
    (tag) => !tags.includes(tag) && tag.toLowerCase().includes(inputValue.toLowerCase())
  );
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    if(newValue.trim() !== '' && filteredSuggestions.length > 0) {
        setOpen(true);
    } else {
        setOpen(false);
    }
  };

  return (
    <div
      className={cn(
        'flex h-auto min-h-10 w-full flex-wrap items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background'
      )}
      onClick={() => inputRef.current?.focus()}
    >
      {tags.map((tag) => (
        <Badge key={tag} variant="secondary" className="text-base">
          {tag}
          <Button
            variant="ghost"
            size="icon"
            className="ml-1 h-4 w-4 rounded-full text-muted-foreground hover:bg-destructive/80 hover:text-destructive-foreground"
            onClick={(e) => {
              e.stopPropagation(); // prevent div click handler from firing
              handleRemoveTag(tag);
            }}
          >
            <X size={14} />
            <span className="sr-only">Remove {tag}</span>
          </Button>
        </Badge>
      ))}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative flex-grow">
            <input
              ref={inputRef}
              placeholder={tags.length > 0 ? '' : placeholder}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => {
                if (inputValue.trim() !== '' && filteredSuggestions.length > 0) {
                    setOpen(true);
                }
              }}
              onBlur={() => setOpen(false)}
              className="h-full w-full bg-transparent p-0 placeholder:text-muted-foreground focus:outline-none"
              {...props}
            />
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="w-[--radix-popover-trigger-width] p-0"
          align="start"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <Command>
            <CommandList>
              {filteredSuggestions.length > 0 && (
                <CommandGroup>
                  {filteredSuggestions.map((tag) => (
                    <CommandItem
                      key={tag}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleAddTag(tag);
                      }}
                      value={tag}
                    >
                      {tag}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
              <CommandEmpty>
                {inputValue ? `No results for "${inputValue}". Press Enter to add.` : 'Type to search.'}
              </CommandEmpty>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
