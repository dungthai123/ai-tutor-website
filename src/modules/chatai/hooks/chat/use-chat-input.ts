'use client';

import { useCallback, useState, useRef } from 'react';
import { useChatStore } from '../storage/chat-store';
import { validationUtils } from '../../utils';

interface UseChatInputState {
  textInput: string;
  isComposing: boolean;
  inputError: string | null;
}

export function useChatInput() {
  const chatStore = useChatStore();
  const [state, setState] = useState<UseChatInputState>({
    textInput: '',
    isComposing: false,
    inputError: null,
  });
  const inputRef = useRef<HTMLInputElement>(null);

  // Set text input
  const setTextInput = useCallback((text: string) => {
    setState(prev => ({ 
      ...prev, 
      textInput: text,
      inputError: null, // Clear error when user types
    }));
  }, []);

  // Set composing state (for IME input)
  const setComposing = useCallback((composing: boolean) => {
    setState(prev => ({ ...prev, isComposing: composing }));
  }, []);

  // Set input error
  const setInputError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, inputError: error }));
  }, []);

  // Validate input
  const validateInput = useCallback((text: string): boolean => {
    if (!validationUtils.isValidMessage(text)) {
      setInputError('Message cannot be empty');
      return false;
    }

    if (text.length > 1000) {
      setInputError('Message is too long (max 1000 characters)');
      return false;
    }

    setInputError(null);
    return true;
  }, [setInputError]);

  // Clear input
  const clearInput = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      textInput: '',
      inputError: null,
    }));
  }, []);

  // Focus input
  const focusInput = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Blur input
  const blurInput = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.blur();
    }
  }, []);

  // Handle text input submission
  const handleTextSubmit = useCallback((onSubmit?: (text: string) => void | Promise<void>) => {
    const trimmedText = state.textInput.trim();
    
    if (!validateInput(trimmedText)) {
      return false;
    }

    if (chatStore.isAwaitingResponse) {
      setInputError('Please wait for the current response');
      return false;
    }

    // Call the submit handler if provided
    if (onSubmit) {
      onSubmit(trimmedText);
    }

    clearInput();
    return true;
  }, [state.textInput, validateInput, chatStore.isAwaitingResponse, setInputError, clearInput]);

  // Handle keyboard events
  const handleKeyDown = useCallback((
    event: React.KeyboardEvent<HTMLInputElement>,
    onSubmit?: (text: string) => void | Promise<void>
  ) => {
    // Don't submit if composing (IME input)
    if (state.isComposing) return;

    if (event.key === 'Enter') {
      event.preventDefault();
      
      if (event.shiftKey) {
        // Shift+Enter: Add newline (if supporting multiline)
        setTextInput(state.textInput + '\n');
      } else {
        // Enter: Submit message
        handleTextSubmit(onSubmit);
      }
    }

    if (event.key === 'Escape') {
      // Escape: Clear input or close keyboard
      if (state.textInput) {
        clearInput();
      } else {
        chatStore.toggleKeyboard();
      }
    }
  }, [state.isComposing, state.textInput, setTextInput, handleTextSubmit, clearInput, chatStore]);

  // Handle composition events (for IME input)
  const handleCompositionStart = useCallback(() => {
    setComposing(true);
  }, [setComposing]);

  const handleCompositionEnd = useCallback(() => {
    setComposing(false);
  }, [setComposing]);

  // Toggle keyboard visibility
  const toggleKeyboard = useCallback(() => {
    chatStore.toggleKeyboard();
    
    // Focus input when showing keyboard
    if (!chatStore.isShowKeyboard) {
      setTimeout(() => focusInput(), 100);
    }
  }, [chatStore, focusInput]);

  // Insert text at cursor position
  const insertTextAtCursor = useCallback((textToInsert: string) => {
    if (!inputRef.current) return;

    const input = inputRef.current;
    const start = input.selectionStart || 0;
    const end = input.selectionEnd || 0;
    const currentText = state.textInput;
    
    const newText = currentText.slice(0, start) + textToInsert + currentText.slice(end);
    setTextInput(newText);

    // Set cursor position after inserted text
    setTimeout(() => {
      const newCursorPos = start + textToInsert.length;
      input.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  }, [state.textInput, setTextInput]);

  // Get input statistics
  const inputStats = useCallback(() => {
    return {
      length: state.textInput.length,
      wordCount: state.textInput.trim().split(/\s+/).filter(word => word.length > 0).length,
      lineCount: state.textInput.split('\n').length,
      isValid: validateInput(state.textInput),
      canSubmit: !chatStore.isAwaitingResponse && validateInput(state.textInput),
    };
  }, [state.textInput, validateInput, chatStore.isAwaitingResponse]);

  // Auto-resize textarea (if using textarea instead of input)
  const autoResizeTextarea = useCallback((textarea: HTMLTextAreaElement) => {
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`; // Max height of 120px
  }, []);

  return {
    // State
    textInput: state.textInput,
    isComposing: state.isComposing,
    inputError: state.inputError,
    isKeyboardVisible: chatStore.isShowKeyboard,
    canSubmit: inputStats().canSubmit,

    // Refs
    inputRef,

    // Actions
    setTextInput,
    clearInput,
    focusInput,
    blurInput,
    toggleKeyboard,
    insertTextAtCursor,

    // Event handlers
    handleTextSubmit,
    handleKeyDown,
    handleCompositionStart,
    handleCompositionEnd,

    // Utilities
    validateInput,
    inputStats,
    autoResizeTextarea,
  };
} 