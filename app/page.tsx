'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiClient, Layout } from '@/lib/api-client';
import { Loader2, Sparkles } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [selectedLayoutId, setSelectedLayoutId] = useState<string>('');
  const [question, setQuestion] = useState('');
  const [showQuestion, setShowQuestion] = useState(false);

  const { data: layouts, isLoading: layoutsLoading } = useQuery({
    queryKey: ['layouts'],
    queryFn: () => apiClient.listLayouts()
  });

  const createReadingMutation = useMutation({
    mutationFn: async () => {
      const reading = await apiClient.createReading();
      await apiClient.selectLayout(reading.id, selectedLayoutId);
      await apiClient.drawCards(reading.id, question || undefined);
      return reading;
    },
    onSuccess: (reading) => {
      router.push(`/reading/${reading.id}`);
    }
  });

  const handleStartReading = () => {
    if (!selectedLayoutId) return;
    createReadingMutation.mutate();
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-purple-600" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Tarot Reading
            </h1>
            <Sparkles className="w-8 h-8 text-purple-600" />
          </div>
          <p className="text-gray-600 text-lg">
            Choose a layout and begin your journey of self-discovery
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select a Layout
            </label>
            {layoutsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
              </div>
            ) : (
              <div className="space-y-3">
                {layouts?.map((layout: Layout) => (
                  <button
                    key={layout.id}
                    onClick={() => setSelectedLayoutId(layout.id)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      selectedLayoutId === layout.id
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-semibold text-gray-900">
                        {layout.name}
                      </h3>
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {layout.cardCount} cards
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{layout.description}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer mb-3">
              <input
                type="checkbox"
                checked={showQuestion}
                onChange={(e) => setShowQuestion(e.target.checked)}
                className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Ask a question or share what's on your mind
              </span>
            </label>
            {showQuestion && (
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="What would you like to know?"
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              />
            )}
          </div>

          <button
            onClick={handleStartReading}
            disabled={!selectedLayoutId || createReadingMutation.isPending}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-6 rounded-lg font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            {createReadingMutation.isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Drawing Cards...
              </>
            ) : (
              'Begin Reading'
            )}
          </button>

          {createReadingMutation.isError && (
            <div className="text-red-600 text-sm text-center">
              {createReadingMutation.error?.message || 'Failed to create reading'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
