import React, { useState, useCallback } from 'react';
import { HealthProfile, RecipeSuggestion, AppState } from './types';
import ProfileForm from './components/ProfileForm';
import ImageAnalyzer from './components/ImageAnalyzer';
import RecipeResult from './components/RecipeResult';
import { analyzeImageForIngredients, suggestRecipe } from './services/geminiService';
import { Utensils } from 'lucide-react';

function App() {
  const [profile, setProfile] = useState<HealthProfile>({
    age: 30,
    sex: 'Female',
    conditions: '',
    goal: 'Maintenance'
  });

  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [identifiedIngredients, setIdentifiedIngredients] = useState<string>('');
  const [recipeSuggestion, setRecipeSuggestion] = useState<RecipeSuggestion | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleImageSelected = useCallback(async (base64: string, mimeType: string) => {
    setAppState(AppState.ANALYZING_IMAGE);
    setErrorMsg(null);
    setRecipeSuggestion(null);

    try {
      // Step 1: Analyze Image
      const ingredients = await analyzeImageForIngredients(base64, mimeType);
      setIdentifiedIngredients(ingredients);
      
      // Step 2: Generate Recipe
      setAppState(AppState.GENERATING_RECIPE);
      const suggestion = await suggestRecipe(ingredients, profile);
      
      setRecipeSuggestion(suggestion);
      setAppState(AppState.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "An unexpected error occurred.");
      setAppState(AppState.ERROR);
    }
  }, [profile]);

  const handleClear = () => {
    setAppState(AppState.IDLE);
    setIdentifiedIngredients('');
    setRecipeSuggestion(null);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
              <Utensils className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-800">NutriSnap</h1>
              <p className="text-xs text-slate-500 font-medium">AI-Powered Health Kitchen</p>
            </div>
          </div>
          <div className="hidden sm:block">
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full">Gemini 3 Pro + 2.5 Flash</span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Intro Text */}
        <div className="mb-8 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 mb-3">What's in your kitchen?</h2>
          <p className="text-slate-600 text-lg">
            Upload a photo of your vegetables or meat. We'll identify them and craft a perfect recipe for <strong>your</strong> health goals.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Inputs (Profile + Upload) */}
          <div className="lg:col-span-5 space-y-6">
            <ProfileForm profile={profile} setProfile={setProfile} />
            <ImageAnalyzer 
              onImageSelected={handleImageSelected} 
              isAnalyzing={appState === AppState.ANALYZING_IMAGE || appState === AppState.GENERATING_RECIPE}
              onClear={handleClear}
            />
            {errorMsg && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                <strong>Error:</strong> {errorMsg}
              </div>
            )}
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-7">
            {appState === AppState.IDLE ? (
              <div className="h-full flex flex-col items-center justify-center p-12 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl bg-white/50">
                <Utensils className="w-16 h-16 mb-4 opacity-20" />
                <p className="text-lg font-medium">Your personalized recipe awaits</p>
                <p className="text-sm opacity-60">Fill out your profile and snap a photo to begin.</p>
              </div>
            ) : (
              <RecipeResult 
                suggestion={recipeSuggestion} 
                isLoading={appState === AppState.GENERATING_RECIPE || appState === AppState.ANALYZING_IMAGE}
                identifiedIngredients={identifiedIngredients}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
