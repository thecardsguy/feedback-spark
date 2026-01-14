import { FileCategory, getCategoryLabel, getAllCategories } from "@/lib/fileRegistry";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CategoryFilterProps {
  selectedCategory: FileCategory | "all";
  onCategoryChange: (category: FileCategory | "all") => void;
}

export function CategoryFilter({
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  const categories = getAllCategories();

  return (
    <Select
      value={selectedCategory}
      onValueChange={(value) => onCategoryChange(value as FileCategory | "all")}
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Filter by category" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Categories</SelectItem>
        {categories.map((category) => (
          <SelectItem key={category} value={category}>
            {getCategoryLabel(category)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
