import React from 'react';
import { HealthProfile } from '../types';
import { User, Activity, Heart, Calendar } from 'lucide-react';

interface ProfileFormProps {
  profile: HealthProfile;
  setProfile: React.Dispatch<React.SetStateAction<HealthProfile>>;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ profile, setProfile }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: name === 'age' ? parseInt(value) || 0 : value
    }));
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
        <User className="w-5 h-5 text-emerald-600" />
        Your Health Profile
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Age */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Age</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="number"
              name="age"
              value={profile.age || ''}
              onChange={handleChange}
              placeholder="e.g. 30"
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        {/* Sex */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Sex</label>
          <div className="relative">
            <select
              name="sex"
              value={profile.sex}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none bg-white transition-all appearance-none"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Goal */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-600 mb-1">Health Goal</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {['Weight Loss', 'Maintenance', 'Muscle Gain', 'General Health'].map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setProfile(prev => ({ ...prev, goal: g as any }))}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${
                  profile.goal === g
                    ? 'bg-emerald-100 border-emerald-500 text-emerald-800'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Conditions */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-600 mb-1">Health Conditions / Allergies</label>
          <div className="relative">
            <Heart className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
            <textarea
              name="conditions"
              value={profile.conditions}
              onChange={handleChange}
              placeholder="e.g. Diabetes, Hypertension, Nut Allergy (Optional)"
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all resize-none h-20"
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProfileForm;
