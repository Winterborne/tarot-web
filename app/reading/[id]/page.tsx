'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient, Card, Interpretation, ConversationMessage } from '@/lib/api-client';
import { Loader2, MessageCircle, Home, ArrowUp, ArrowDown } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function ReadingPage() {
  const params = useParams();
  const readingId = params.id as string;
  const queryClient = useQueryClient();
  const [followUpQuestion, setFollowUpQuestion] = useState('');
  const [showFollowUp, setShowFollowUp] = useState(false);

  const { data: reading, isLoading: readingLoading } = useQuery({
    queryKey: ['reading', readingId],
    queryFn: () => apiClient.getReading(readingId),
    enabled: !!readingId
  });

  const { data: interpretation, isLoading: interpretationLoading } = useQuery({
    queryKey: ['interpretation', readingId],
    queryFn: () => apiClient.getInterpretation(readingId),
    enabled: !!readingId,
    retry: 15,
    retryDelay: 2000
  });

  const { data: conversation } = useQuery({
    queryKey: ['conversation', interpretation?.id],
    queryFn: () => apiClient.getConversation(interpretation!.id),
    enabled: !!interpretation?.id
  });

  const followUpMutation = useMutation({
    mutationFn: (question: string) =>
      apiClient.askFollowUp(interpretation!.id, question),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['conversation', interpretation?.id]
      });
      setFollowUpQuestion('');
      setShowFollowUp(false);
    }
  });

  const handleFollowUp = () => {
    if (!followUpQuestion.trim()) return;
    followUpMutation.mutate(followUpQuestion);
  };

  if (readingLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
        >
          <Home className="w-4 h-4" />
          Start New Reading
        </Link>

        {reading?.question && (
          <div className="bg-purple-50 border-l-4 border-purple-600 p-6 rounded-r-lg">
            <p className="text-sm text-purple-700 font-medium mb-1">
              Your Question
            </p>
            <p className="text-lg text-gray-800 italic">"{reading.question}"</p>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span>🎴</span> Your Cards
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reading?.cards?.map((card: Card) => (
              <div
                key={card.id}
                className="flex flex-col items-center space-y-3"
              >
                <div className="relative w-full aspect-[2/3] max-w-[200px]">
                  <Image
                    src={`/cards/${card.id}.jpg`}
                    alt={card.name}
                    fill
                    className={`object-contain rounded-lg shadow-lg ${
                      card.orientation === 'reversed' ? 'rotate-180' : ''
                    }`}
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="text-center space-y-1">
                  <div className="flex items-center justify-center gap-2">
                    <h3 className="font-semibold text-gray-900">{card.name}</h3>
                    {card.orientation === 'upright' ? (
                      <ArrowUp className="w-4 h-4 text-green-600" />
                    ) : (
                      <ArrowDown className="w-4 h-4 text-yellow-600" />
                    )}
                  </div>
                  <p className="text-sm text-purple-600 font-medium">
                    {card.positionName}
                  </p>
                  <p className="text-xs text-gray-600">{card.positionDescription}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {interpretationLoading ? (
          <div className="bg-white rounded-2xl shadow-xl p-12">
            <div className="flex flex-col items-center justify-center gap-4">
              <Loader2 className="w-12 h-12 animate-spin text-purple-600" />
              <p className="text-gray-600">
                Generating your interpretation...
              </p>
              <p className="text-sm text-gray-500">
                This may take 30-60 seconds for larger spreads
              </p>
            </div>
          </div>
        ) : interpretation ? (
          <>
            <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
              <div className="text-center pb-6 border-b border-gray-200">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  ✨ Your Interpretation ✨
                </h2>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg">
                <h3 className="text-sm font-semibold text-purple-700 uppercase tracking-wide mb-2">
                  Overall Theme
                </h3>
                <p className="text-lg text-gray-800 leading-relaxed">
                  {interpretation.overallTheme}
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900">
                  Card Interpretations
                </h3>
                {interpretation.cardInterpretations.map((cardInterp) => (
                  <div
                    key={cardInterp.position}
                    className="border-l-4 border-purple-400 pl-4 py-2"
                  >
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {cardInterp.cardName} - {cardInterp.positionName}
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      {cardInterp.interpretation}
                    </p>
                  </div>
                ))}
              </div>

              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Narrative
                </h3>
                <div className="prose prose-lg max-w-none text-gray-700">
                  {interpretation.narrative.split('\n\n').map((paragraph, i) => (
                    <p key={i} className="mb-4 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>

            {conversation && conversation.length > 0 && (
              <div className="bg-white rounded-2xl shadow-xl p-8 space-y-4">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Conversation History
                </h3>
                {conversation.map((message: ConversationMessage) => (
                  <div key={message.id} className="space-y-2 pb-4 border-b border-gray-200 last:border-0">
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <p className="text-sm font-medium text-purple-700 mb-1">
                        You asked:
                      </p>
                      <p className="text-gray-800 italic">"{message.question}"</p>
                    </div>
                    <div className="pl-4">
                      <p className="text-gray-700 leading-relaxed">{message.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-xl p-8">
              {!showFollowUp ? (
                <button
                  onClick={() => setShowFollowUp(true)}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-6 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  Ask a Follow-Up Question
                </button>
              ) : (
                <div className="space-y-4">
                  <textarea
                    value={followUpQuestion}
                    onChange={(e) => setFollowUpQuestion(e.target.value)}
                    placeholder="What would you like to know more about?"
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={handleFollowUp}
                      disabled={!followUpQuestion.trim() || followUpMutation.isPending}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      {followUpMutation.isPending ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Getting Answer...
                        </>
                      ) : (
                        'Send Question'
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setShowFollowUp(false);
                        setFollowUpQuestion('');
                      }}
                      className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                  {followUpMutation.isError && (
                    <div className="text-red-600 text-sm">
                      {followUpMutation.error?.message || 'Failed to send question'}
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
