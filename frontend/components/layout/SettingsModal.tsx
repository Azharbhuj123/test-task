import { useState } from 'react';
import { useSettings } from '../../hooks/useSettings';
import { X, Key, CheckCircle2, AlertCircle } from 'lucide-react';
import { Spinner } from '../ui/Spinner';

interface SettingsModalProps {
  onClose: () => void;
}

export function SettingsModal({ onClose }: SettingsModalProps) {
  const { settings, isLoading, updateKey, isUpdating, clearKey } = useSettings();
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSave = async () => {
    setError('');
    setSuccess('');

    const val = apiKeyInput.trim();
    if (!val) {
      setError('Please enter an API key.');
      return;
    }
    if (!val.startsWith('sk-')) {
      setError('OpenAI API keys typically start with "sk-".');
      return;
    }

    try {
      await updateKey(val);
      setApiKeyInput('');
      setSuccess('API key updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: unknown) {
      setError((err as Record<string, unknown>)?.response ? (((err as Record<string, unknown>).response as Record<string, unknown>)?.data as Record<string, unknown>)?.error as string : 'Failed to update API key.');
    }
  };

  const handleClear = async () => {
    if (confirm('Are you sure you want to clear the API key? The agent will not work without it.')) {
      try {
        await clearKey();
        setSuccess('API key cleared.');
        setTimeout(() => setSuccess(''), 3000);
      } catch {
        setError('Failed to clear API key.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-center px-5 py-4 border-b bg-gray-50">
          <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <Key size={16} className="text-gray-500" />
            Settings
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-gray-200">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          <div className="mb-5">
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              OpenAI API Key
            </label>
            <p className="text-[11px] text-gray-500 mb-3 leading-relaxed">
              This key is required for the agent to function. It is stored securely in the backend <code className="bg-gray-100 text-gray-700 px-1 py-0.5 rounded">.env</code> file.
            </p>

            {isLoading ? (
              <div className="flex justify-center py-4">
                <Spinner className="w-5 h-5 text-blue-500" />
              </div>
            ) : (
              <div className="space-y-4">
                {/* Current Key Status */}
                {settings?.isConfigured ? (
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-100 rounded-xl">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-green-500" />
                      <div>
                        <p className="text-xs font-bold text-green-900">Key Configured</p>
                        <p className="text-[10px] text-green-700 font-mono mt-0.5">{settings.keyPreview}</p>
                      </div>
                    </div>
                    <button
                      onClick={handleClear}
                      className="text-[10px] font-semibold text-red-600 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50 transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-100 rounded-xl text-amber-800">
                    <AlertCircle size={16} className="flex-shrink-0" />
                    <p className="text-[11px] font-medium leading-snug">No API key configured. The agent will fail to respond.</p>
                  </div>
                )}

                {/* Input New Key */}
                <div>
                  <input
                    type="password"
                    placeholder="sk-..."
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    className="w-full text-sm px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all font-mono"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSave();
                    }}
                  />
                  
                  {error && <p className="text-[10px] text-red-500 mt-1.5 ml-1">{error}</p>}
                  {success && <p className="text-[10px] text-green-600 mt-1.5 ml-1">{success}</p>}
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleSave}
              disabled={isUpdating || !apiKeyInput.trim()}
              className={`px-4 py-2 text-xs font-semibold text-white rounded-lg transition-all flex items-center gap-1.5 ${
                isUpdating || !apiKeyInput.trim()
                  ? 'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed opacity-70'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-sm hover:shadow active:scale-95'
              }`}
            >
              {isUpdating && <Spinner className="w-3 h-3 text-white" />}
              Save Key
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
