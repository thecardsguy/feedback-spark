import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, FileCode, Layers, BarChart3 } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoryFilter } from "@/components/codemap/CategoryFilter";
import { FileCard } from "@/components/codemap/FileCard";
import {
  fileRegistry,
  FileCategory,
  searchFiles,
  getFilesByCategory,
  getStats,
} from "@/lib/fileRegistry";

export default function CodeMap() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<FileCategory | "all">("all");

  const stats = useMemo(() => getStats(), []);

  const filteredFiles = useMemo(() => {
    let files = fileRegistry;

    // Apply category filter
    if (selectedCategory !== "all") {
      files = getFilesByCategory(selectedCategory);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const searchResults = searchFiles(searchQuery);
      files = files.filter((file) =>
        searchResults.some((result) => result.id === file.id)
      );
    }

    return files;
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="container-custom py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-foreground mb-2">Code Map</h1>
          <p className="text-muted-foreground">
            Visual overview of all files in the project with descriptions and relationships
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <FileCode className="w-4 h-4" />
                Total Files
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">{stats.totalFiles}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Total Lines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">
                {stats.totalLines.toLocaleString()}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Layers className="w-4 h-4" />
                Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-foreground">
                {stats.categoryCounts.length}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 mb-6"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search files by name, path, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </motion.div>

        {/* Results count */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="text-sm text-muted-foreground mb-4"
        >
          Showing {filteredFiles.length} of {stats.totalFiles} files
          {selectedCategory !== "all" && ` in ${selectedCategory}`}
          {searchQuery && ` matching "${searchQuery}"`}
        </motion.p>

        {/* File List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-3"
        >
          {filteredFiles.length > 0 ? (
            filteredFiles.map((file, index) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.02 }}
              >
                <FileCard file={file} />
              </motion.div>
            ))
          ) : (
            <div className="text-center py-12">
              <FileCode className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No files match your search criteria</p>
            </div>
          )}
        </motion.div>

        {/* Category Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12"
        >
          <h2 className="text-xl font-semibold text-foreground mb-4">Category Breakdown</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {stats.categoryCounts.map((cat) => (
              <button
                key={cat.category}
                onClick={() => setSelectedCategory(cat.category as FileCategory)}
                className={`p-3 rounded-lg border text-left transition-colors hover:bg-accent/50 ${
                  selectedCategory === cat.category
                    ? "border-primary bg-primary/10"
                    : "border-border bg-card"
                }`}
              >
                <p className="font-medium text-foreground text-sm">{cat.label}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {cat.count} files • {cat.lines.toLocaleString()} lines
                </p>
              </button>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
