'use client';

import { useChat } from 'ai/react';
import { ChatInput } from '@/components/ChatInput';
import { ChatMessage } from '@/components/ChatMessage';
import { FileUpload } from '@/components/FileUpload';
import { useState, useRef, useEffect } from 'react';

export default function Home() {
  const [showUpload, setShowUpload] = useState(false);
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: '/api/chat',
    initialMessages: [
      {
        id: 'welcome',
        role: 'assistant',
        content: 'Hi! I\'m your AI assistant. You can chat with me directly or upload a document to get more specific answers!'
      }
    ],
    onError: (error) => {
      console.error('Chat error:', error);
    }
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleUploadComplete = (success: boolean) => {
    if (success) {
      setShowUpload(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">RAG Chat Assistant</h1>
          <button 
            onClick={() => setShowUpload(!showUpload)}
            className="text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
          >
            {showUpload ? 'Back to Chat' : 'Upload Document'}
          </button>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto pt-20 pb-24">
        <div className="max-w-3xl mx-auto">
          {showUpload ? (
            <div className="p-8">
              <FileUpload onUploadComplete={handleUploadComplete} />
            </div>
          ) : (
            <>
              {error && (
                <div className="mx-4 py-4 px-6 bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-400 text-sm rounded-lg">
                  {error.message}
                </div>
              )}
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {isLoading && (
                <ChatMessage
                  message={{
                    id: 'loading',
                    role: 'assistant',
                    content: '...'
                  }}
                />
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </main>

      {/* Input */}
      {!showUpload && (
        <ChatInput
          input={input}
          setInput={handleInputChange}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
