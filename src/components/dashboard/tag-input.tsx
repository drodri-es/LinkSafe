'use client';

import { Check, X } from 'lucide-react';
import React, { useCallback, useRef, useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

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
    if (e.key === 'Enter') {
      e.preventDefault();
      if (inputValue) {
        handleAddTag(inputValue);
      }
    }
    if (e.key === 'Backspace' && !inputValue) {
      e.preventDefault();
      handleRemoveTag(tags[tags.length - 1]);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    if(newValue.trim() !== '') {
        setOpen(true);
    } else {
        setOpen(false);
    }
  };

  const filteredSuggestions = allTags.filter(
    (tag) => !tags.includes(tag) && tag.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div
        className={cn(
          'flex h-auto min-h-10 w-full flex-wrap items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background'
        )}
        onClick={() => inputRef.current?.focus()}
      >
        {tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="text-sm">
            {tag}
            <button
              type="button"
              className="ml-1 h-4 w-4 rounded-full text-muted-foreground ring-offset-background transition-colors hover:bg-destructive/80 hover:text-destructive-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              onClick={(e) => {
                e.stopPropagation(); // prevent div click handler from firing
                handleRemoveTag(tag);
              }}
            >
              <X size={12} />
              <span className="sr-only">Remove {tag}</span>
            </button>
          </Badge>
        ))}
        <PopoverTrigger asChild>
            <input
              ref={inputRef}
              type="text"
              placeholder={tags.length > 0 ? '' : placeholder}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => {
                if(inputValue.trim() !== '') {
                    setOpen(true);
                }
              }}
              onBlur={() => {
                // We need to delay the blur event to allow the popover to be clicked
                setTimeout(() => setOpen(false), 150)
              }}
              className="flex-1 bg-transparent p-0 text-sm placeholder:text-muted-foreground focus:outline-none"
              {...props}
            />
        </PopoverTrigger>
      </div>
      <PopoverContent
        className="w-[--radix-popover-trigger-width] p-0"
        align="start"
      >
        <Command>
          <CommandInput value={inputValue} onValueChange={setInputValue} placeholder="Search tags..."/>
          <CommandList>
            <CommandEmpty>
                {inputValue ? `No results for "${inputValue}". Press Enter to add.` : 'Type to see suggestions.'}
            </CommandEmpty>
            {filteredSuggestions.length > 0 && (
              <CommandGroup>
                {filteredSuggestions.map((tag) => (
                  <CommandItem
                    key={tag}
                    onSelect={() => handleAddTag(tag)}
                    value={tag}
                  >
                    <Check
                        className={cn(
                        "mr-2 h-4 w-4",
                        tags.includes(tag) ? "opacity-100" : "opacity-0"
                        )}
                    />
                    {tag}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
