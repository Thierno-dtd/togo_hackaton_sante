import React, { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '@core/auth/auth.store';
import { useConversations, useSendMessage, useCreerConversation } from '../hooks/useExpertMedical';
import type { ConversationMessage, Conversation } from '../types/patient.types';

const DISCLAIMER =
  "⚠️ Les informations fournies par l'expert médical IA sont à titre informatif uniquement et ne remplacent pas une consultation médicale. En cas d'urgence, contactez le SAMU (119) ou rendez-vous aux urgences les plus proches.";

const ExpertMedicalPatient: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const patientId = user?.id ?? '';
  const { data: conversations, isLoading } = useConversations(user?.id);
  const sendMessage = useSendMessage(patientId);
  const creerConversation = useCreerConversation(patientId);

  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Load messages when selecting a conversation
  useEffect(() => {
    if (selectedConv) {
      setMessages(selectedConv.messages);
    }
  }, [selectedConv]);

  const handleSend = async () => {
    if (!input.trim() || sendMessage.isPending) return;

    const userMessage: ConversationMessage = {
      id: `msg_${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const userInput = input.trim();
    setInput('');
    setIsTyping(true);

    try {
      if (!selectedConv) {
        // Créer une nouvelle conversation
        const newConv = await creerConversation.mutateAsync(userInput);
        setSelectedConv(newConv);
      }

      const response = await sendMessage.mutateAsync({
        conversationId: selectedConv?.id,
        message: userInput,
      });

      setMessages((prev) => [...prev, response.message]);
    } catch {
      // Error handled by toast in hook
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const startNewConversation = () => {
    setSelectedConv(null);
    setMessages([]);
    setInput('');
  };

  const suggestions = [
    'J\'ai des douleurs à la poitrine',
    'Comment gérer mon stress ?',
    'Effets secondaires de mes médicaments',
    'Quand dois-je renouveler mon ordonnance ?',
  ];

  if (isLoading) {
    return (
      <div className="page-content">
        <div className="content-body text-center py-12">
          <i className="fas fa-spinner fa-spin text-3xl text-primary"></i>
          <p className="mt-4">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="content-header-app">
        <div
          className="header-image"
          style={{
            background:
              'linear-gradient(rgba(139, 92, 246, 0.8), rgba(139, 92, 246, 0.9)), url(https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80)',
            backgroundSize: 'cover',
          }}
        >
          <div className="header-overlay">
            <h1>Expert Médical IA</h1>
            <p>Posez vos questions de santé à notre assistant intelligent</p>
          </div>
        </div>
      </div>

      <div className="content-body">
        {/* Disclaimer */}
        <div className="alert alert-warning mb-6">
          <span>{DISCLAIMER}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Historique conversations */}
          <div className="lg:col-span-1">
            <div className="content-card-app">
              <div className="flex items-center justify-between mb-4">
                <h3 className="card-title mb-0">Conversations</h3>
                <button className="btn btn-sm btn-primary" onClick={startNewConversation}>
                  <i className="fas fa-plus"></i>
                </button>
              </div>
              <div className="space-y-2">
                {conversations?.map((conv) => (
                  <button
                    key={conv.id}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedConv?.id === conv.id
                        ? 'bg-purple-50 border border-purple-200'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedConv(conv)}
                  >
                    <p className="font-medium text-sm truncate">{conv.titre}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(conv.dernierMessage).toLocaleDateString('fr-FR')}
                    </p>
                  </button>
                ))}
                {(!conversations || conversations.length === 0) && (
                  <p className="text-sm text-gray-400 text-center py-4">
                    Aucune conversation
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Chat area */}
          <div className="lg:col-span-3">
            <div className="content-card-app flex flex-col" style={{ minHeight: '500px' }}>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ maxHeight: '400px' }}>
                {messages.length === 0 && (
                  <div className="text-center py-12">
                    <i className="fas fa-robot text-5xl text-purple-300 mb-4"></i>
                    <h3 className="text-lg font-medium mb-2">Bienvenue !</h3>
                    <p className="text-gray-500 mb-6">
                      Posez une question sur votre santé ou choisissez un sujet ci-dessous.
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {suggestions.map((s, idx) => (
                        <button
                          key={idx}
                          className="btn btn-outline btn-sm"
                          onClick={() => {
                            setInput(s);
                          }}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-4 rounded-2xl ${
                        msg.role === 'user'
                          ? 'bg-purple-600 text-white rounded-br-none'
                          : 'bg-gray-100 text-gray-800 rounded-bl-none'
                      }`}
                    >
                      {msg.role === 'assistant' && (
                        <div className="flex items-center gap-2 mb-2">
                          <i className="fas fa-robot text-purple-500"></i>
                          <span className="text-xs font-semibold text-purple-600">
                            Expert IA
                          </span>
                        </div>
                      )}
                      <p className="whitespace-pre-wrap text-sm">{msg.content}</p>
                      <p
                        className={`text-xs mt-2 ${
                          msg.role === 'user' ? 'text-purple-200' : 'text-gray-400'
                        }`}
                      >
                        {new Date(msg.timestamp).toLocaleTimeString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                      {msg.sources && msg.sources.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-gray-200">
                          <p className="text-xs text-gray-400">
                            Sources : {msg.sources.join(', ')}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 p-4 rounded-2xl rounded-bl-none">
                      <div className="flex items-center gap-2">
                        <i className="fas fa-robot text-purple-500"></i>
                        <span className="typing-indicator">
                          <span className="dot"></span>
                          <span className="dot"></span>
                          <span className="dot"></span>
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t p-4">
                <div className="flex gap-3">
                  <textarea
                    className="form-control flex-1 resize-none"
                    placeholder="Posez votre question..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    rows={2}
                    disabled={sendMessage.isPending}
                  />
                  <button
                    className="btn btn-primary self-end"
                    onClick={handleSend}
                    disabled={!input.trim() || sendMessage.isPending}
                  >
                    <i className="fas fa-paper-plane"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpertMedicalPatient;
