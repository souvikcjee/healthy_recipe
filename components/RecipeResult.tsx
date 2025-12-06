import React from 'react';
import { RecipeSuggestion, GroundingLink } from '../types';
import { ChefHat, Link2, ExternalLink, Leaf } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface RecipeResultProps {
  suggestion: RecipeSuggestion | null;
  isLoading: boolean;
  identifiedIngredients: string;
}

const RecipeResult: React.FC<RecipeResultProps> = ({ suggestion, isLoading, identifiedIngredients }) => {
  if (isLoading) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-emerald-100 flex flex-col items-center justify-center min-h-[400px] animate-pulse">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
          <ChefHat className="w-8 h-8 text-emerald-600 animate-bounce" />
        </div>
        <h3 className="text-xl font-semibold text-slate-800 mb-2">Crafting your recipe...</h3>
        <p className="text-slate-500 text-center max-w-md">
          Searching for healthy options based on identified ingredients:
          <span className="block mt-2 font-medium text-emerald-700">{identifiedIngredients}</span>
        </p>
      </div>
    );
  }

  if (!suggestion) {
    return null;
  }

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-emerald-100">
      <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
        <div className="p-2 bg-emerald-100 rounded-lg">
          <Leaf className="w-6 h-6 text-emerald-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Recommended Recipe</h2>
          <p className="text-sm text-slate-500">Tailored to your health profile</p>
        </div>
      </div>

      <div className="prose prose-emerald max-w-none">
        <ReactMarkdown>{suggestion.content}</ReactMarkdown>
      </div>

      {suggestion.groundingLinks.length > 0 && (
        <div className="mt-8 pt-6 border-t border-slate-100">
          <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Link2 className="w-4 h-4" />
            Sources & References
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {suggestion.groundingLinks.map((link, idx) => (
              <a 
                key={idx} 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 rounded-lg border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all group"
              >
                <span className="text-sm font-medium text-slate-700 truncate flex-1 group-hover:text-emerald-700">
                  {link.title}
                </span>
                <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-emerald-500" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeResult;
