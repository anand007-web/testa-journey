
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { getCategories, saveCategory } from '@/data/quizModels';
import { Badge } from '@/components/ui/badge';
import { PlusCircleIcon, EditIcon, SaveIcon, XIcon } from 'lucide-react';
import { Category } from '@/integrations/supabase/client';

const CategoryManager: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState<Partial<Category>>({
    name: '',
    description: '',
  });
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setIsLoading(true);
    try {
      const loadedCategories = await getCategories();
      setCategories(loadedCategories as unknown as Category[]);
    } catch (error) {
      console.error('Error loading categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.name) {
      toast.error('Category name is required');
      return;
    }

    // Check for duplicate name
    if (categories.some(c => c.name.toLowerCase() === newCategory.name?.toLowerCase())) {
      toast.error('A category with this name already exists');
      return;
    }

    try {
      const category: any = {
        id: crypto.randomUUID(),
        name: newCategory.name,
        description: newCategory.description || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await saveCategory(category);
      setNewCategory({ name: '', description: '' });
      await loadCategories();
      toast.success('Category added successfully');
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('Failed to add category');
    }
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategoryId(category.id);
    setNewCategory({
      name: category.name,
      description: category.description,
    });
  };

  const handleUpdateCategory = async () => {
    if (!newCategory.name || !editingCategoryId) {
      toast.error('Category name is required');
      return;
    }

    // Check for duplicate name (excluding the current category)
    if (categories.some(c => 
      c.name.toLowerCase() === newCategory.name?.toLowerCase() && 
      c.id !== editingCategoryId
    )) {
      toast.error('A category with this name already exists');
      return;
    }

    try {
      const existingCategory = categories.find(c => c.id === editingCategoryId);
      if (existingCategory) {
        const updatedCategory: any = {
          ...existingCategory,
          name: newCategory.name,
          description: newCategory.description || null,
          updated_at: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        await saveCategory(updatedCategory);
        setNewCategory({ name: '', description: '' });
        setEditingCategoryId(null);
        await loadCategories();
        toast.success('Category updated successfully');
      }
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('Failed to update category');
    }
  };

  const handleCancelEdit = () => {
    setEditingCategoryId(null);
    setNewCategory({ name: '', description: '' });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quiz Categories</CardTitle>
        <CardDescription>
          Create and manage categories for organizing your quizzes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-3">
            <div>
              <label htmlFor="category-name" className="text-sm font-medium">
                Category Name
              </label>
              <Input
                id="category-name"
                placeholder="e.g., Mathematics, English, Reasoning"
                value={newCategory.name || ''}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <label htmlFor="category-description" className="text-sm font-medium">
                Description (Optional)
              </label>
              <Textarea
                id="category-description"
                placeholder="Brief description of this category"
                value={newCategory.description || ''}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                className="mt-1"
              />
            </div>
            {editingCategoryId ? (
              <div className="flex gap-2 mt-3">
                <Button onClick={handleUpdateCategory} className="flex-1">
                  <SaveIcon className="mr-2 h-4 w-4" />
                  Update Category
                </Button>
                <Button variant="outline" onClick={handleCancelEdit}>
                  <XIcon className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              </div>
            ) : (
              <Button onClick={handleAddCategory} className="w-full mt-3">
                <PlusCircleIcon className="mr-2 h-4 w-4" />
                Add Category
              </Button>
            )}
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-3">Existing Categories</h3>
            <div className="space-y-2">
              {isLoading ? (
                <p className="text-center py-4 text-muted-foreground">Loading categories...</p>
              ) : categories.length > 0 ? (
                categories.map((category) => (
                  <div 
                    key={category.id} 
                    className="p-3 border rounded-md flex justify-between items-center"
                  >
                    <div>
                      <h4 className="font-medium">{category.name}</h4>
                      {category.description && (
                        <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
                      )}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleEditCategory(category)}
                    >
                      <EditIcon className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-center py-4 text-muted-foreground">No categories yet. Create one above.</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryManager;
