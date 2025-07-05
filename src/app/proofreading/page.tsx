'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { GrammarEditor, GrammarEditorRef } from '@/modules/proofreading/components/GrammarEditor';
import { EditorActions } from '@/modules/proofreading/components/EditorActions';
import { TextSuggestion } from '@/modules/proofreading/components/TextSuggestion';
import { CorrectionTooltipWrapper } from '@/modules/proofreading/components/CorrectionTooltip';
import { useProofreader } from '@/modules/proofreading/hooks/useProofreader';
import { LoadingSpinner } from '@/modules/aitutor/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/modules/aitutor/components/ui/ErrorMessage';
import { MainLayout } from '@/shared/components/layout/MainLayout';


export default function ProofreadingPage() {
  const editorRef = useRef<GrammarEditorRef>(null);
  const [content, setContent] = useState('');
  const [isEditable, setIsEditable] = useState(true);
  const [characterCount, setCharacterCount] = useState(0);
  
  const { result, loading, error, proofread, reset, clearError } = useProofreader();

  const handleEditorUpdate = useCallback((newContent: string) => {
    setContent(newContent);
    setCharacterCount(editorRef.current?.getCharacterCount() || 0);
  }, []);

  const handleProofread = useCallback(async () => {
    const text = editorRef.current?.getText() || '';
    console.log('[PROOFREAD_PAGE] Proofreading text:', text.substring(0, 100) + '...');
    if (!text.trim()) return;

    await proofread(text);
  }, [proofread]);

  const applyCorrections = useCallback(() => {
    if (!result || !editorRef.current?.editor) return;

    console.log('[PROOFREAD_PAGE] Applying corrections:', result.edits.length, 'edits');
    const editor = editorRef.current.editor;
    const correctionText = result.correction;
    
    // Clear any existing marks first
    editor.commands.unsetMark('correction');
    
    // Apply highlights to corrections
    let searchOffset = 0;
    result.edits.forEach((edit, index) => {
      // Find the next occurrence of newText starting from searchOffset
      const startPos = correctionText.indexOf(edit.newText, searchOffset);
      if (startPos !== -1) {
        const endPos = startPos + edit.newText.length;
        console.log('[PROOFREAD_PAGE] Applying correction mark:', edit.newText, 'at position', startPos, '-', endPos);
        
        // Convert to editor positions (TipTap uses 1-based positioning)
        const from = startPos + 1;
        const to = endPos + 1;
        
        // Set text selection and apply correction mark
        editor.commands.setTextSelection({ from, to });
        editor.commands.setMark('correction', {
          'data-edit-index': index.toString(),
          'data-correction': 'true'
        });
        
        // Update search offset to avoid finding the same text again
        searchOffset = endPos;
      }
    });
    
    // Clear selection
    editor.commands.setTextSelection(1);
  }, [result]);

  // Handle result changes
  useEffect(() => {
    if (result && editorRef.current) {
      console.log('[PROOFREAD_PAGE] Result received, applying corrections...');
      
      // First set the corrected content
      editorRef.current.setContent(result.correction);
      setIsEditable(false);
      
      // Apply correction highlights after a short delay to ensure content is set
      const timeoutId = setTimeout(() => {
        applyCorrections();
      }, 200);
      
      return () => clearTimeout(timeoutId);
    }
  }, [result, applyCorrections]);

  const handleReset = useCallback(() => {
    reset();
    setIsEditable(true);
    setContent('');
    setCharacterCount(0);
    editorRef.current?.clear();
    editorRef.current?.focus();
  }, [reset]);

  const handleCopy = useCallback(async () => {
    const text = editorRef.current?.getText() || '';
    if (text) {
      try {
        await navigator.clipboard.writeText(text);
        // You could add a toast notification here
      } catch (err) {
        console.error('Failed to copy text:', err);
      }
    }
  }, []);

  const handleEdit = useCallback(() => {
    const newEditableState = !isEditable;
    setIsEditable(newEditableState);
    editorRef.current?.setEditable(newEditableState);
  }, [isEditable]);

  const handleApplySuggestion = useCallback(() => {
    if (result?.suggestion && editorRef.current) {
      editorRef.current.setContent(result.suggestion);
      setIsEditable(true);
    }
  }, [result]);

  return (
    <MainLayout>
    <div className=" mx-auto p-4 md:p-8 max-w-4xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          AI Proofreading Tool
        </h1>
        <p className="text-lg text-gray-600">
          Write or paste your text below and get instant feedback on grammar, spelling, and style.
        </p>
      </header>

      <div className="space-y-6">
        {/* Error Message */}
        {error && (
          <ErrorMessage 
            error={error}
            onRetry={clearError}
          />
        )}

        {/* Main Editor Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Loading Overlay */}
          {loading && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
              <LoadingSpinner />
            </div>
          )}

          {/* Editor */}
          <div className="relative">
            {result ? (
              <CorrectionTooltipWrapper 
                edits={result.edits}
                className="min-h-[300px]"
              >
                <GrammarEditor
                  ref={editorRef}
                  initialContent={content}
                  editable={isEditable}
                  onUpdate={handleEditorUpdate}
                  placeholder="Start typing your text here..."
                  className="min-h-[300px]"
                />
              </CorrectionTooltipWrapper>
            ) : (
              <GrammarEditor
                ref={editorRef}
                initialContent={content}
                editable={isEditable}
                onUpdate={handleEditorUpdate}
                placeholder="Start typing your text here..."
                className="min-h-[300px]"
              />
            )}
          </div>

          {/* Actions */}
          <EditorActions
            onProofread={handleProofread}
            onReset={handleReset}
            onCopy={handleCopy}
            onEdit={handleEdit}
            isLoading={loading}
            isEditable={isEditable}
            hasResult={!!result}
            characterCount={characterCount}
          />
        </div>

        {/* Suggestion */}
        {result?.suggestion && (
          <TextSuggestion
            suggestion={result.suggestion}
            onApply={handleApplySuggestion}
          />
        )}

        {/* Results Summary */}
        {result && (
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Proofreading Results
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {result.edits.length}
                </div>
                <div className="text-gray-600">Corrections Made</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {characterCount}
                </div>
                <div className="text-gray-600">Characters</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {result.suggestion ? '1' : '0'}
                </div>
                <div className="text-gray-600">Suggestions</div>
              </div>
            </div>
            {result.edits.length > 0 && (
              <p className="mt-4 text-sm text-gray-600">
                💡 Click on highlighted text to see correction details
              </p>
            )}
          </div>
        )}
      </div>
    </div>
    </MainLayout>
  );
} 