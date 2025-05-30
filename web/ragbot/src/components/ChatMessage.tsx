import { Message } from 'ai';
import { useEffect, useRef } from 'react';
import clsx from 'clsx';

export function ChatMessage({ message }: { message: Message }) {
  const isLoading = message.id === 'loading';

  return (
    <div
      className={clsx(
        'flex w-full items-start gap-4 p-6',
        message.role === 'assistant' ? 'bg-gray-50 dark:bg-gray-800' : ''
      )}
    >
      <div
        className={clsx(
          'rounded-full h-8 w-8 flex items-center justify-center',
          message.role === 'assistant' ? 'bg-green-500' : 'bg-blue-500'
        )}
      >
        {message.role === 'assistant' ? '🤖' : '👤'}
      </div>
      <div className="flex-1 space-y-4">
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <div
              className="h-2 w-2 rounded-full bg-gray-400 animate-bounce"
              style={{ animationDelay: '0ms' }}
            />
            <div
              className="h-2 w-2 rounded-full bg-gray-400 animate-bounce"
              style={{ animationDelay: '150ms' }}
            />
            <div
              className="h-2 w-2 rounded-full bg-gray-400 animate-bounce"
              style={{ animationDelay: '300ms' }}
            />
          </div>
        ) : (
          <div className="prose dark:prose-invert prose-p:leading-relaxed prose-pre:p-0">
            {message.role === 'user' ? (
              <p className="font-semibold">{message.content}</p>
            ) : (
              <p>{message.content}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
