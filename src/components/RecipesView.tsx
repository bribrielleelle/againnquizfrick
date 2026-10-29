import React, { useState, useEffect, useMemo } from 'react';
import { Recipe, RECIPES_DATA, RECIPE_CATEGORIES } from '../data/recipes';
import { 
  Search, 
  Sparkles, 
  Clock, 
  ChefHat, 
  Heart, 
  Printer, 
  X, 
  Check, 
  BookOpen, 
  Scale, 
  Flame, 
  Utensils, 
  Award, 
  ChevronRight,
  Filter,
  Play,
  RotateCcw,
  Pause,
  ArrowRight
} from 'lucide-react';

interface RecipesViewProps {
  onStartQuizById?: (quizId: string) => void;
}

const STORAGE_SAVED_RECIPES = 'eclairwiz_saved_recipes_ids';

export const RecipesView: React.FC<RecipesViewProps> = ({ onStartQuizById }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All Sweets');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  // Saved favorites in localStorage
  const [savedRecipeIds, setSavedRecipeIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SAVED_RECIPES);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_SAVED_RECIPES, JSON.stringify(savedRecipeIds));
    } catch {}
  }, [savedRecipeIds]);

  const toggleFavorite = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSavedRecipeIds((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Recipe detail states
  const [servingsMultiplier, setServingsMultiplier] = useState<number>(1);
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string, boolean>>({});
  const [checkedSteps, setCheckedSteps] = useState<Record<number, boolean>>({});
  const [unitSystem, setUnitSystem] = useState<'metric' | 'us'>('metric');

  // Kitchen Timer states inside recipe modal
  const [timerSecondsLeft, setTimerSecondsLeft] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [initialTimerSeconds, setInitialTimerSeconds] = useState(600); // 10 mins default

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && timerSecondsLeft !== null && timerSecondsLeft > 0) {
      interval = setInterval(() => {
        setTimerSecondsLeft((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else if (timerSecondsLeft === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSecondsLeft]);

  const handleOpenRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setServingsMultiplier(1);
    setCheckedIngredients({});
    setCheckedSteps({});
    setTimerSecondsLeft(null);
    setIsTimerRunning(false);
  };

  const handleCloseRecipe = () => {
    setSelectedRecipe(null);
    setIsTimerRunning(false);
  };

  const startQuickTimer = (minutes: number) => {
    const secs = minutes * 60;
    setInitialTimerSeconds(secs);
    setTimerSecondsLeft(secs);
    setIsTimerRunning(true);
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setTimerSecondsLeft(initialTimerSeconds);
  };

  // Format timer MM:SS
  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Filter recipes
  const filteredRecipes = useMemo(() => {
    return RECIPES_DATA.filter((recipe) => {
      // Category filter
      if (selectedCategory !== 'All Sweets' && recipe.category !== selectedCategory) {
        return false;
      }
      // Difficulty filter
      if (selectedDifficulty !== 'All' && recipe.difficulty !== selectedDifficulty) {
        return false;
      }
      // Favorites filter
      if (onlyFavorites && !savedRecipeIds.includes(recipe.id)) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = recipe.title.toLowerCase().includes(q);
        const matchesFrench = recipe.frenchTitle.toLowerCase().includes(q);
        const matchesDesc = recipe.description.toLowerCase().includes(q);
        const matchesTags = recipe.tags.some((t) => t.toLowerCase().includes(q));
        const matchesIngredients = recipe.ingredients.some((i) => i.item.toLowerCase().includes(q));
        if (!matchesTitle && !matchesFrench && !matchesDesc && !matchesTags && !matchesIngredients) {
          return false;
        }
      }
      return true;
    });
  }, [selectedCategory, selectedDifficulty, onlyFavorites, savedRecipeIds, searchQuery]);

  const getDifficultyColor = (diff: Recipe['difficulty']) => {
    switch (diff) {
      case 'Beginner':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'Intermediate':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'Advanced':
        return 'bg-rose-100 text-rose-900 border-rose-300';
      case 'Master Baker':
        return 'bg-purple-100 text-purple-950 border-purple-300';
      default:
        return 'bg-pink-100 text-pink-900 border-pink-300';
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-in fade-in duration-200">
      
      {/* HERO BANNER: Styled after the Boudoir Rococo Picture Frame */}
      <div className="w-full relative">
        {/* Top Black Ribbon Bow Accent */}
        <div className="absolute -top-4 -left-3 sm:-left-4 z-20 text-3xl sm:text-4xl drop-shadow-md select-none transform -rotate-12">
          🎀
        </div>

        {/* Scalloped Bakery Seal / Badge in Top-Right Corner */}
        <div className="absolute -top-4 -right-2 sm:-right-4 z-20 select-none">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-pink-500 text-white border-2 border-neutral-900 flex flex-col items-center justify-center text-center p-1 shadow-lg transform rotate-6 hover:rotate-0 transition-transform">
            <span className="text-xs sm:text-sm">🍰</span>
            <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-tight leading-tight">
              Chef<br/>Recipes
            </span>
          </div>
        </div>

        {/* The Baroque Rococo Picture Frame Header */}
        <div className="bg-white/95 rounded-3xl rococo-frame p-6 sm:p-10 text-center relative overflow-hidden">
          {/* Filigree Corner Flourishes */}
          <div className="absolute top-2 left-2 text-pink-300 font-script text-xl select-none">❦</div>
          <div className="absolute top-2 right-2 text-pink-300 font-script text-xl select-none">❦</div>
          <div className="absolute bottom-2 left-2 text-pink-300 font-script text-xl select-none">❦</div>
          <div className="absolute bottom-2 right-2 text-pink-300 font-script text-xl select-none">❦</div>

          {/* Subtitle pill badge */}
          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-xs font-bold bg-pink-100 border border-pink-300 text-pink-900 shadow-xs mb-3">
            <span>🍓</span>
            <span className="tracking-widest uppercase text-[11px] font-black">Patisserie &amp; Confection Ledger</span>
            <span>🥐</span>
          </div>

          <h1 className="font-script text-4xl sm:text-6xl text-neutral-900 leading-tight">
            From our Pastry Atelier —
          </h1>

          <div className="font-playfair italic font-black text-3xl sm:text-4xl text-pink-600 tracking-tight mt-1 flex items-center justify-center gap-2">
            <span>🍰</span>
            <span>Artisanal Sweet &amp; Dessert Recipes</span>
            <span>✨</span>
          </div>

          <p className="mt-3 text-xs sm:text-sm text-neutral-700 max-w-xl mx-auto leading-relaxed">
            Step inside our bakery kitchen with tested recipes from Parisian chocolate éclairs and raspberry rose macarons to warm apple tarte tatin and molten chocolate lava fondant.
          </p>

          {/* Search Bar */}
          <div className="mt-6 max-w-md mx-auto relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-500">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search recipes, ingredients, or tags (e.g. choux, chocolate)..."
              className="w-full pl-10 pr-10 py-2.5 rounded-full bg-pink-50/70 border-2 border-pink-300 focus:border-neutral-900 focus:bg-white text-xs text-neutral-900 placeholder:text-neutral-500 outline-none transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Stats Bar */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-xs font-bold">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 border border-pink-300 text-neutral-800">
              <span>📖</span>
              <span>{RECIPES_DATA.length} Chef Recipes Available</span>
            </span>
            <button
              onClick={() => setOnlyFavorites(!onlyFavorites)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full border transition-all cursor-pointer ${
                onlyFavorites
                  ? 'bg-pink-600 text-white border-pink-700 shadow-sm'
                  : 'bg-white hover:bg-pink-50 text-neutral-800 border-pink-300'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-current text-white' : 'text-pink-600'}`} />
              <span>My Saved Favorites ({savedRecipeIds.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* FILTER CONTROLS: Category Ribbon & Difficulty Selector */}
      <div className="space-y-3">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {RECIPE_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer shadow-xs flex items-center gap-1.5 ${
                selectedCategory === cat
                  ? 'bg-neutral-900 text-pink-200 border-2 border-neutral-900 scale-105'
                  : 'bg-white hover:bg-pink-100 text-neutral-800 border-2 border-pink-200'
              }`}
            >
              <span>{cat === 'French Patisserie' ? '🥐' : cat === 'Cakes & Gateaux' ? '🎂' : cat === 'Tartes & Viennoiserie' ? '🥧' : cat === 'Custards & Spoon Desserts' ? '🍮' : cat === 'Cookies & Confections' ? '🍪' : '🍰'}</span>
              <span>{cat}</span>
            </button>
          ))}
        </div>

        {/* Secondary Difficulty Filter */}
        <div className="flex items-center justify-between flex-wrap gap-2 px-1 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-neutral-700">
            <Filter className="w-3.5 h-3.5 text-pink-600" />
            <span>Difficulty:</span>
            {['All', 'Beginner', 'Intermediate', 'Advanced', 'Master Baker'].map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-2.5 py-0.5 rounded-full text-[11px] transition-all cursor-pointer font-bold ${
                  selectedDifficulty === diff
                    ? 'bg-pink-600 text-white shadow-xs'
                    : 'bg-pink-100/70 text-neutral-700 hover:bg-pink-200'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>

          <span className="text-[11px] font-black uppercase tracking-wider text-neutral-500">
            Showing {filteredRecipes.length} {filteredRecipes.length === 1 ? 'sweet' : 'sweets'}
          </span>
        </div>
      </div>

      {/* RECIPES CARDS GRID */}
      {filteredRecipes.length === 0 ? (
        <div className="p-12 rounded-3xl bg-white/95 rococo-frame text-center space-y-3">
          <div className="text-4xl">🧁</div>
          <h3 className="font-playfair italic font-black text-2xl text-neutral-900">
            No Sweet Recipes Found
          </h3>
          <p className="text-xs text-neutral-600 max-w-sm mx-auto">
            {onlyFavorites 
              ? 'You have not favorited any recipes yet! Click the heart on any sweet treat to save it here.'
              : 'Try clearing your search query or selecting "All Sweets" to see our full dessert atelier.'}
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All Sweets');
              setSelectedDifficulty('All');
              setOnlyFavorites(false);
            }}
            className="px-4 py-2 rounded-full bg-neutral-900 hover:bg-pink-600 text-white font-black text-xs uppercase tracking-wider transition-all cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => {
            const isFav = savedRecipeIds.includes(recipe.id);
            return (
              <div
                key={recipe.id}
                onClick={() => handleOpenRecipe(recipe)}
                className="rounded-3xl boutique-card p-6 flex flex-col justify-between group transition-all duration-200 hover:-translate-y-1 relative overflow-hidden cursor-pointer"
              >
                {/* Top pink scallop highlight */}
                <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-pink-300 via-pink-400 to-pink-300" />

                <div>
                  {/* Card Header with Category, Difficulty, & Favorite Button */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-900 border border-pink-300 flex items-center gap-1 shadow-xs">
                      <span>{recipe.emoji}</span>
                      <span>{recipe.category}</span>
                    </span>

                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${getDifficultyColor(recipe.difficulty)}`}>
                        {recipe.difficulty}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => toggleFavorite(recipe.id, e)}
                        className={`p-1.5 rounded-full transition-all cursor-pointer ${
                          isFav
                            ? 'text-pink-600 hover:text-pink-700 bg-pink-100'
                            : 'text-neutral-400 hover:text-pink-600 hover:bg-pink-50'
                        }`}
                        title={isFav ? 'Remove from favorites' : 'Save to favorites'}
                      >
                        <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* French and English Titles */}
                  <div className="space-y-1">
                    <h3 className="font-playfair font-bold text-xl text-neutral-900 group-hover:text-pink-600 transition-colors leading-snug">
                      {recipe.title}
                    </h3>
                    <p className="font-script text-base text-pink-700 leading-none">
                      {recipe.frenchTitle}
                    </p>
                  </div>

                  <p className="text-xs text-neutral-600 mt-2.5 leading-relaxed line-clamp-2">
                    {recipe.description}
                  </p>

                  {/* Timing & Servings info */}
                  <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] font-bold text-neutral-600">
                    <span className="inline-flex items-center gap-1 bg-pink-50/80 px-2.5 py-1 rounded-full border border-pink-200">
                      <Clock className="w-3 h-3 text-pink-600" />
                      <span>Prep: {recipe.prepTime}</span>
                    </span>
                    <span className="inline-flex items-center gap-1 bg-pink-50/80 px-2.5 py-1 rounded-full border border-pink-200">
                      <Flame className="w-3 h-3 text-rose-500" />
                      <span>Bake: {recipe.bakeTime}</span>
                    </span>
                    <span className="inline-flex items-center gap-1 bg-pink-50/80 px-2.5 py-1 rounded-full border border-pink-200">
                      <Utensils className="w-3 h-3 text-neutral-500" />
                      <span>{recipe.servings} Servings</span>
                    </span>
                  </div>

                  {/* Tags */}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {recipe.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white/90 text-neutral-600 border border-pink-200"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Footer */}
                <div className="mt-5 pt-3.5 border-t-2 border-pink-100 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-pink-700 flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{recipe.steps.length} Steps · {recipe.ingredients.length} Ingredients</span>
                  </span>

                  <span className="inline-flex items-center gap-1 text-xs font-black uppercase text-neutral-900 group-hover:text-pink-600 group-hover:translate-x-1 transition-all">
                    <span>View Recipe</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DETAILED RECIPE BOOK MODAL */}
      {selectedRecipe && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-neutral-950/80 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
          <div className="relative w-full max-w-3xl max-h-[92vh] bg-white rococo-frame rounded-3xl p-6 sm:p-9 shadow-2xl flex flex-col overflow-y-auto my-auto">
            
            {/* Top Black Ribbon Bow */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-3xl select-none">
              🎀
            </div>

            {/* Close Button */}
            <button
              onClick={handleCloseRecipe}
              className="absolute top-5 right-5 p-2 rounded-full text-neutral-500 hover:text-neutral-900 hover:bg-pink-100 transition-colors cursor-pointer"
              title="Close recipe book"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="text-center pb-4 border-b-2 border-pink-200 mt-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-pink-100 text-pink-900 border border-pink-300 mb-2">
                <span>{selectedRecipe.emoji}</span>
                <span>{selectedRecipe.category}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                <span className={`px-2 py-0.2 rounded-full ${getDifficultyColor(selectedRecipe.difficulty)}`}>
                  {selectedRecipe.difficulty}
                </span>
              </div>

              <h2 className="font-playfair italic font-black text-3xl sm:text-4xl text-neutral-900 leading-tight">
                {selectedRecipe.title}
              </h2>
              <p className="font-script text-2xl text-pink-700 mt-0.5">
                {selectedRecipe.frenchTitle}
              </p>
              <p className="text-xs sm:text-sm text-neutral-600 max-w-xl mx-auto mt-2 leading-relaxed">
                {selectedRecipe.description}
              </p>

              {/* Timing, Servings & Calories Overview */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-xs font-bold">
                <span className="px-3 py-1.5 rounded-xl bg-pink-50 border border-pink-300 text-neutral-800 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-pink-600" />
                  <span>Prep: <strong>{selectedRecipe.prepTime}</strong></span>
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-pink-50 border border-pink-300 text-neutral-800 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-rose-500" />
                  <span>Bake: <strong>{selectedRecipe.bakeTime}</strong></span>
                </span>
                {selectedRecipe.chillTime && (
                  <span className="px-3 py-1.5 rounded-xl bg-pink-50 border border-pink-300 text-neutral-800 flex items-center gap-1.5">
                    <span>❄️</span>
                    <span>Chill: <strong>{selectedRecipe.chillTime}</strong></span>
                  </span>
                )}
                {selectedRecipe.caloriesPerServing && (
                  <span className="px-3 py-1.5 rounded-xl bg-pink-50 border border-pink-300 text-neutral-800 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-amber-500" />
                    <span>~{selectedRecipe.caloriesPerServing} kcal / serving</span>
                  </span>
                )}
              </div>

              {/* Action Buttons: Favorite, Print & Quiz Link */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                <button
                  onClick={() => toggleFavorite(selectedRecipe.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                    savedRecipeIds.includes(selectedRecipe.id)
                      ? 'bg-pink-600 text-white border-pink-700 shadow-xs'
                      : 'bg-white hover:bg-pink-50 text-neutral-800 border-pink-300'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${savedRecipeIds.includes(selectedRecipe.id) ? 'fill-current' : 'text-pink-600'}`} />
                  <span>{savedRecipeIds.includes(selectedRecipe.id) ? 'Saved to Favorites' : 'Save Recipe'}</span>
                </button>

                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-white hover:bg-pink-50 text-neutral-800 border border-pink-300 transition-all cursor-pointer flex items-center gap-1.5"
                  title="Print recipe card"
                >
                  <Printer className="w-3.5 h-3.5 text-neutral-600" />
                  <span>Print Recipe</span>
                </button>

                {selectedRecipe.associatedQuizId && onStartQuizById && (
                  <button
                    onClick={() => {
                      const qId = selectedRecipe.associatedQuizId!;
                      handleCloseRecipe();
                      onStartQuizById(qId);
                    }}
                    className="px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider bg-neutral-900 hover:bg-pink-600 text-pink-200 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 border border-neutral-900 shadow-xs"
                  >
                    <span>🥐</span>
                    <span>Test Your Knowledge on this Quiz →</span>
                  </button>
                )}
              </div>
            </div>

            {/* BAKER KITCHEN TIMER WIDGET */}
            <div className="my-4 p-3.5 rounded-2xl bg-gradient-to-r from-pink-100 via-rose-50 to-pink-100 border-2 border-pink-300 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white border-2 border-neutral-900 flex items-center justify-center text-lg shadow-xs">
                  ⏱️
                </div>
                <div>
                  <div className="text-xs font-black uppercase tracking-wider text-pink-900">
                    Baker's Kitchen Timer
                  </div>
                  <div className="text-[11px] text-neutral-600">
                    Quick timers for baking stages &amp; precision rests
                  </div>
                </div>
              </div>

              {timerSecondsLeft !== null ? (
                <div className="flex items-center gap-3">
                  <div className={`font-mono font-black text-2xl tracking-widest px-3 py-1 rounded-xl bg-white border-2 ${
                    timerSecondsLeft === 0 ? 'border-rose-500 text-rose-600 animate-bounce' : 'border-neutral-900 text-neutral-900'
                  }`}>
                    {timerSecondsLeft === 0 ? 'DING! 🔔' : formatTimer(timerSecondsLeft)}
                  </div>
                  <button
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className="p-2 rounded-full bg-neutral-900 text-white hover:bg-pink-600 transition-colors cursor-pointer"
                    title={isTimerRunning ? 'Pause' : 'Start'}
                  >
                    {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={resetTimer}
                    className="p-2 rounded-full bg-white border border-pink-300 text-neutral-700 hover:bg-pink-100 transition-colors cursor-pointer"
                    title="Reset timer"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setIsTimerRunning(false);
                      setTimerSecondsLeft(null);
                    }}
                    className="text-xs text-neutral-500 hover:underline"
                  >
                    Hide
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 flex-wrap">
                  {[3, 5, 10, 15, 30].map((mins) => (
                    <button
                      key={mins}
                      onClick={() => startQuickTimer(mins)}
                      className="px-2.5 py-1 rounded-full text-xs font-bold bg-white hover:bg-pink-200 border border-pink-300 text-neutral-800 transition-colors cursor-pointer shadow-xs"
                    >
                      {mins}m
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* TWO-COLUMN INGREDIENTS & INSTRUCTIONS */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-2">
              
              {/* LEFT COLUMN: Ingredients with Servings Scaler */}
              <div className="lg:col-span-5 space-y-4">
                <div className="p-5 rounded-2xl bg-pink-50/70 border-2 border-pink-300">
                  <div className="flex items-center justify-between pb-3 border-b-2 border-pink-200">
                    <div className="flex items-center gap-1.5">
                      <Scale className="w-4 h-4 text-pink-600" />
                      <h3 className="font-playfair font-bold text-lg text-neutral-900">
                        Ingredients
                      </h3>
                    </div>

                    {/* Unit System Toggle */}
                    <div className="flex items-center gap-1 bg-white rounded-full p-0.5 border border-pink-300 text-[10px] font-black uppercase">
                      <button
                        onClick={() => setUnitSystem('metric')}
                        className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                          unitSystem === 'metric' ? 'bg-neutral-900 text-white' : 'text-neutral-600'
                        }`}
                      >
                        Metric (g/ml)
                      </button>
                      <button
                        onClick={() => setUnitSystem('us')}
                        className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                          unitSystem === 'us' ? 'bg-neutral-900 text-white' : 'text-neutral-600'
                        }`}
                      >
                        US Units
                      </button>
                    </div>
                  </div>

                  {/* Servings Scaler (- / +) */}
                  <div className="mt-3 flex items-center justify-between bg-white/90 p-2 rounded-xl border border-pink-200 text-xs">
                    <span className="font-bold text-neutral-700">Yield:</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setServingsMultiplier((prev) => Math.max(0.5, prev - 0.5))}
                        className="w-6 h-6 rounded-full bg-pink-100 hover:bg-pink-200 font-black text-neutral-800 flex items-center justify-center cursor-pointer transition-colors"
                        title="Reduce servings"
                      >
                        -
                      </button>
                      <span className="font-black text-pink-700 min-w-16 text-center">
                        {Math.round(selectedRecipe.servings * servingsMultiplier)} servings ({servingsMultiplier}x)
                      </span>
                      <button
                        onClick={() => setServingsMultiplier((prev) => Math.min(4, prev + 0.5))}
                        className="w-6 h-6 rounded-full bg-pink-100 hover:bg-pink-200 font-black text-neutral-800 flex items-center justify-center cursor-pointer transition-colors"
                        title="Increase servings"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <p className="text-[11px] text-neutral-500 italic mt-1.5">
                    Tap ingredients to cross them off as you measure:
                  </p>

                  {/* Ingredient Checklist */}
                  <ul className="mt-3 space-y-2">
                    {selectedRecipe.ingredients.map((ing, idx) => {
                      const isChecked = checkedIngredients[`${ing.item}-${idx}`] || false;
                      const rawAmount = (unitSystem === 'metric' && ing.metricAmount) 
                        ? ing.metricAmount * servingsMultiplier 
                        : ing.amount * servingsMultiplier;
                      
                      // Round cleanly
                      const displayAmount = Number.isInteger(rawAmount) 
                        ? rawAmount 
                        : Number(rawAmount.toFixed(1));

                      const displayUnit = (unitSystem === 'metric' && ing.metricUnit) 
                        ? ing.metricUnit 
                        : ing.unit;

                      return (
                        <li
                          key={idx}
                          onClick={() => {
                            setCheckedIngredients((prev) => ({
                              ...prev,
                              [`${ing.item}-${idx}`]: !isChecked
                            }));
                          }}
                          className={`p-2 rounded-xl flex items-start gap-2.5 cursor-pointer transition-all border ${
                            isChecked
                              ? 'bg-pink-100/50 text-neutral-400 border-transparent line-through'
                              : 'bg-white hover:bg-pink-50/80 text-neutral-800 border-pink-200/80 shadow-2xs'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded-md border mt-0.5 flex items-center justify-center flex-shrink-0 transition-colors ${
                            isChecked
                              ? 'bg-pink-500 border-pink-500 text-white'
                              : 'border-pink-300 bg-pink-50'
                          }`}>
                            {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <div className="text-xs leading-snug">
                            <strong className="text-pink-900 font-black mr-1">
                              {displayAmount} {displayUnit}
                            </strong>
                            <span>{ing.item}</span>
                            {ing.note && (
                              <span className="text-[10px] text-neutral-500 italic ml-1">
                                ({ing.note})
                              </span>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Equipment Box */}
                <div className="p-4 rounded-2xl bg-white border-2 border-pink-200 shadow-2xs">
                  <h4 className="font-playfair font-bold text-sm text-neutral-900 flex items-center gap-1.5 mb-2">
                    <Utensils className="w-3.5 h-3.5 text-pink-600" />
                    <span>Baker's Equipment Needed</span>
                  </h4>
                  <ul className="space-y-1 text-xs text-neutral-700">
                    {selectedRecipe.equipment.map((eq, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <span className="text-pink-500">•</span>
                        <span>{eq}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* RIGHT COLUMN: Step-by-Step Instructions */}
              <div className="lg:col-span-7 space-y-4">
                <div className="p-5 rounded-2xl bg-white border-2 border-pink-300 shadow-2xs">
                  <div className="flex items-center justify-between pb-3 border-b-2 border-pink-200 mb-4">
                    <h3 className="font-playfair font-bold text-lg text-neutral-900 flex items-center gap-1.5">
                      <ChefHat className="w-4 h-4 text-pink-600" />
                      <span>Step-by-Step Baker's Method</span>
                    </h3>
                    <span className="text-[11px] font-bold text-pink-700">
                      {Object.values(checkedSteps).filter(Boolean).length} / {selectedRecipe.steps.length} Steps Completed
                    </span>
                  </div>

                  <div className="space-y-4">
                    {selectedRecipe.steps.map((step) => {
                      const isCompleted = checkedSteps[step.stepNumber] || false;
                      return (
                        <div
                          key={step.stepNumber}
                          onClick={() => {
                            setCheckedSteps((prev) => ({
                              ...prev,
                              [step.stepNumber]: !isCompleted
                            }));
                          }}
                          className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                            isCompleted
                              ? 'bg-pink-50/50 border-pink-200 opacity-75'
                              : 'bg-white hover:border-pink-400 border-pink-100 shadow-2xs'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 transition-colors ${
                              isCompleted
                                ? 'bg-pink-600 text-white'
                                : 'bg-neutral-900 text-pink-200'
                            }`}>
                              {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : step.stepNumber}
                            </div>

                            <div className="flex-1 space-y-1">
                              <h4 className={`font-playfair font-bold text-sm ${isCompleted ? 'line-through text-neutral-500' : 'text-neutral-900'}`}>
                                {step.title}
                              </h4>
                              <p className={`text-xs leading-relaxed ${isCompleted ? 'text-neutral-400' : 'text-neutral-700'}`}>
                                {step.instruction}
                              </p>

                              {/* Chef Secret Tip */}
                              {step.chefTip && (
                                <div className="mt-2.5 p-2.5 rounded-xl bg-pink-50 border border-pink-300 text-[11px] text-pink-950 flex items-start gap-2">
                                  <Sparkles className="w-3.5 h-3.5 text-pink-600 flex-shrink-0 mt-0.5" />
                                  <div>
                                    <strong className="text-pink-900 font-black">Chef Brielle's Secret: </strong>
                                    <span>{step.chefTip}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Pro Tips Box */}
                {selectedRecipe.proTips && selectedRecipe.proTips.length > 0 && (
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-100 via-rose-50 to-pink-100 border-2 border-pink-300 shadow-2xs">
                    <h4 className="font-playfair italic font-black text-base text-neutral-900 flex items-center gap-1.5 mb-2">
                      <span>✨</span>
                      <span>Golden Rules for Bakery Perfection</span>
                    </h4>
                    <ul className="space-y-1.5 text-xs text-neutral-800">
                      {selectedRecipe.proTips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-pink-600 font-bold">❦</span>
                          <span className="leading-relaxed">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Bottom Footer */}
            <div className="mt-6 pt-4 border-t-2 border-pink-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <span className="text-neutral-600 italic">
                Bon appétit! Share your creations with #EclairWizPatisserie 🍰
              </span>
              <button
                onClick={handleCloseRecipe}
                className="px-6 py-2 rounded-full font-black uppercase tracking-wider text-white bg-neutral-900 hover:bg-pink-600 transition-all cursor-pointer border border-pink-200 shadow-xs"
              >
                Close Recipe Book
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
