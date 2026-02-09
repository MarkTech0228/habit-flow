import React, { useState } from 'react';
import { X, Search, Sparkles, ChevronRight, Book, Briefcase, Heart, Zap } from 'lucide-react';


// HABIT TEMPLATES
interface HabitTemplate {
  title: string;
  icon: string;
  colorTheme: string;
  category: 'student' | 'adult' | 'health' | 'productivity';
  description: string;
}
interface TemplateBrowserProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: HabitTemplate) => void;
}


const TemplateBrowser: React.FC<TemplateBrowserProps> = ({
  isOpen,
  onClose,
  onSelectTemplate
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'student' | 'adult' | 'health' | 'productivity'>('all');


  const templates: HabitTemplate[] = [
    // Student Templates
    { title: 'Study 1 Hour', icon: 'Book', colorTheme: 'Blue', category: 'student', description: 'Dedicated study time daily' },
    { title: 'Complete Homework', icon: 'Target', colorTheme: 'Purple', category: 'student', description: 'Finish daily assignments' },
    { title: 'Read 30 Minutes', icon: 'Book', colorTheme: 'Emerald', category: 'student', description: 'Build reading habit' },
    { title: 'Review Notes', icon: 'Brain', colorTheme: 'Pink', category: 'student', description: 'Daily note review' },
   
    // Adult/Work Templates
    { title: 'Morning Routine', icon: 'Coffee', colorTheme: 'Orange', category: 'adult', description: 'Start day right' },
    { title: 'Check Emails', icon: 'Briefcase', colorTheme: 'Sky', category: 'adult', description: 'Stay on top of inbox' },
    { title: 'Plan Tomorrow', icon: 'Target', colorTheme: 'Violet', category: 'adult', description: 'Evening planning session' },
    { title: 'Learn New Skill', icon: 'Brain', colorTheme: 'Fuchsia', category: 'adult', description: 'Continuous learning' },
   
    // Health Templates
    { title: 'Morning Exercise', icon: 'Dumbbell', colorTheme: 'Green', category: 'health', description: 'Start with movement' },
    { title: 'Drink 8 Glasses Water', icon: 'Droplet', colorTheme: 'Cyan', category: 'health', description: 'Stay hydrated' },
    { title: 'Take Vitamins', icon: 'Pill', colorTheme: 'Rose', category: 'health', description: 'Daily supplements' },
    { title: 'Stretch 10 Minutes', icon: 'Dumbbell', colorTheme: 'Teal', category: 'health', description: 'Improve flexibility' },
    { title: 'Meditate', icon: 'Brain', colorTheme: 'Purple', category: 'health', description: 'Mindfulness practice' },
   
    // Productivity Templates
    { title: 'Deep Work Session', icon: 'Brain', colorTheme: 'Blue', category: 'productivity', description: '2 hours focused work' },
    { title: 'Clear Inbox', icon: 'Briefcase', colorTheme: 'Green', category: 'productivity', description: 'Inbox zero daily' },
    { title: 'Daily Goals Review', icon: 'Target', colorTheme: 'Pink', category: 'productivity', description: 'Track progress' },
    { title: 'Clean Workspace', icon: 'Home', colorTheme: 'Sky', category: 'productivity', description: 'Organize environment' },
  ];


  const categories = [
    { id: 'all', label: 'All Templates', icon: Sparkles },
    { id: 'student', label: 'Student', icon: Book },
    { id: 'adult', label: 'Work/Life', icon: Briefcase },
    { id: 'health', label: 'Health', icon: Heart },
    { id: 'productivity', label: 'Productivity', icon: Zap },
  ];


  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });


  const handleSelectTemplate = (template: HabitTemplate) => {
    onSelectTemplate(template);
    onClose();
  };


  if (!isOpen) return null;


  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-800 rounded-3xl max-w-3xl w-full max-h-[90vh] shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                  Habit Templates
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Choose from popular habits
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>


          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search templates..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white focus:border-pink-500 focus:outline-none"
            />
          </div>
        </div>


        {/* Category Tabs */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>


        {/* Templates Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-600 dark:text-slate-400 text-lg">
                No templates found matching "{searchQuery}"
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {filteredTemplates.map((template, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectTemplate(template)}
                  className="text-left p-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 hover:border-pink-500 dark:hover:border-pink-500 transition-all hover:shadow-lg group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-black text-slate-900 dark:text-white mb-1 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
                        {template.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {template.description}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors flex-shrink-0 ml-2" />
                  </div>
                 
                  <div className="flex items-center gap-2 mt-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      template.category === 'student' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
                      template.category === 'adult' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400' :
                      template.category === 'health' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                      'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
                    }`}>
                      {template.category.charAt(0).toUpperCase() + template.category.slice(1)}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                      {template.colorTheme}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>


        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 rounded-b-3xl">
          <p className="text-xs text-center text-slate-600 dark:text-slate-400">
            Can't find what you're looking for? Create a custom habit instead!
          </p>
        </div>
      </div>
    </div>
  );
};


export default TemplateBrowser;






