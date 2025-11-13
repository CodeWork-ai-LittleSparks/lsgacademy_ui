import React, { useState, useMemo } from 'react';
import { Search, Filter, ChevronDown } from 'lucide-react';
import { detailedProgramsData, programCategories } from '@/lib/mockData';
import ProgramCard from './ProgramCard';

export default function ProgramGrid({ onViewLevels, onEdit, onDelete }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  // Filter programs based on search and category
  const filteredPrograms = useMemo(() => {
    return detailedProgramsData.filter(program => {
      const matchesSearch = program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           program.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           program.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'All Categories' || program.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setShowCategoryDropdown(false);
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search programs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Category Filter */}
        <div className="relative">
          <button
            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 min-w-[120px] justify-between"
          >
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">{selectedCategory}</span>
            </div>
            <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${showCategoryDropdown ? 'rotate-180' : ''}`} />
          </button>

          {showCategoryDropdown && (
            <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              {programCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategorySelect(category)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors duration-150 first:rounded-t-lg last:rounded-b-lg ${
                    selectedCategory === category ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {filteredPrograms.length} of {detailedProgramsData.length} programs
        </p>
        
        {selectedCategory !== 'All Categories' && (
          <button
            onClick={() => setSelectedCategory('All Categories')}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Programs Grid */}
      {filteredPrograms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrograms.map((program) => (
            <ProgramCard
              key={program.id}
              program={program}
              onViewLevels={onViewLevels}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Search className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No programs found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm 
              ? `No programs match "${searchTerm}"`
              : `No programs found in "${selectedCategory}" category`
            }
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All Categories');
            }}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* Category Summary */}
      {selectedCategory !== 'All Categories' && filteredPrograms.length > 0 && (
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-2">{selectedCategory} Programs</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-blue-600">Programs:</span>
              <span className="ml-1 font-medium text-blue-900">{filteredPrograms.length}</span>
            </div>
            <div>
              <span className="text-blue-600">Total Schools:</span>
              <span className="ml-1 font-medium text-blue-900">
                {filteredPrograms.reduce((sum, program) => sum + program.schools, 0)}
              </span>
            </div>
            <div>
              <span className="text-blue-600">Total Students:</span>
              <span className="ml-1 font-medium text-blue-900">
                {filteredPrograms.reduce((sum, program) => sum + program.students, 0)}
              </span>
            </div>
            <div>
              <span className="text-blue-600">Avg Levels:</span>
              <span className="ml-1 font-medium text-blue-900">
                {Math.round(filteredPrograms.reduce((sum, program) => sum + program.levels, 0) / filteredPrograms.length)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}