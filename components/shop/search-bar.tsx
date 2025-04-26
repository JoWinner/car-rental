"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative w-full md:w-auto md:flex-1 max-w-md">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input
        placeholder="Search cars for sale by make, model, or keyword..."
        className="pl-10 pr-4 py-2 w-full rounded-full border-gray-200 focus:border-red-500 focus:ring focus:ring-red-200"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
