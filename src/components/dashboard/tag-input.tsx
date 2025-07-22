'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Command, CommandInput, CommandList, CommandItem, CommandEmpty } from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Tag as TagIcon } from 'lucide-react';

type TagInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> & {
  value: string;
  onChange: (value: string) => void;
  allTags: string[];
};

export function TagInput({ value, onChange, allTags, className, ...props }: TagInputProps) {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [currentTyping, setCurrentTyping] = useState('');

  const existingTags = value ? value.split(',').map(tag => tag.trim()).filter(Boolean) : [];

  const handleSelect = useCallback((tag: string) => {
    const newTags = [...existingTags];
    const lastTagPartiallyTyped = currentTyping.length > 0;
    
    if (lastTagPartiallyTyped) {
      // replace the partially typed tag with the selected one
      newTags[newTags.length-1] = tag;
    } else {
      // add the new tag
      if (!newTags.includes(tag)) {
        newTags.push(tag);
      }
    }
    
    onChange(newTags.join(', ') + ', ');
    setCurrentTyping('');
    setOpen(false);
    inputRef.current?.focus();
  }, [value, onChange, currentTyping]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
    const parts = e.target.value.split(',');
    const lastPart = parts[parts.length - 1].trim();
    setCurrentTyping(lastPart);
    if(lastPart) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  };
  
  const filteredSuggestions = allTags.filter(
    (tag) =>
      !existingTags.includes(tag) &&
      tag.toLowerCase().includes(currentTyping.toLowerCase())
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative">
          <TagIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            {...props}
            ref={inputRef}
            value={value}
            onChange={handleInputChange}
            className={cn('pl-9', className)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') e.preventDefault();
              if (e.key === 'Escape') setOpen(false);
            }}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
        <Command>
          <CommandInput 
            placeholder="Type to search or add..."
            value={currentTyping}
            onValueChange={ (search) => {
              const fullInputValue = value.substring(0, value.lastIndexOf(',') + 1) + ' ' + search;
              onChange(fullInputValue)
              setCurrentTyping(search)
            }}
          />
          <CommandList>
            <CommandEmpty>No matching tags found.</CommandEmpty>
            {filteredSuggestions.map((tag) => (
              <CommandItem key={tag} onSelect={() => handleSelect(tag)}>
                {tag}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
