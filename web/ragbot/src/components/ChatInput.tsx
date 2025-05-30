import { useRef } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import clsx from 'clsx';

interface ChatInputProps {
  input: string;
  setInput: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

export function ChatInput({ input, setInput, onSubmit, isLoading }: ChatInputProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  return (
    <form onSubmit={onSubmit} className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-white dark:from-gray-900 p-4">
      <div className="mx-auto max-w-3xl flex items-center gap-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-2">
        <TextareaAutosize
          ref={inputRef}
          tabIndex={0}
          rows={1}
          value={input}
          onChange={setInput}
          placeholder="Message..."
          spellCheck={false}
          className="min-h-[44px] w-full resize-none bg-transparent px-4 py-[10px] focus:outline-none dark:text-white"
          maxRows={5}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              const form = e.currentTarget.form;
              if (form) form.dispatchEvent(new Event('submit', { cancelable: true }));
            }
          }}
        />
        <button
          disabled={isLoading || input.trim().length === 0}
          className={clsx(
            "inline-flex items-center justify-center rounded-md px-4 py-2 font-semibold text-white transition-colors",
            (isLoading || input.trim().length === 0)
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-black hover:bg-gray-700 dark:bg-white dark:text-black dark:hover:bg-gray-200"
          )}
        >
          {isLoading ? 'Thinking...' : 'Send'}
        </button>
      </div>
    </form>
  );
}
