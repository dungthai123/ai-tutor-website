'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { GrammarEditor, GrammarEditorRef } from '@/modules/proofreading/components/GrammarEditor';
import { EditorActions } from '@/modules/proofreading/components/EditorActions';
import { TextSuggestion } from '@/modules/proofreading/components/TextSuggestion';
import { CorrectionTooltipWrapper } from '@/modules/proofreading/components/CorrectionTooltip';
import { WritingHelperForm } from '@/modules/proofreading/components/WritingHelperForm';
import { WritingHelperResults } from '@/modules/proofreading/components/WritingHelperResults';
import { useProofreader } from '@/modules/proofreading/hooks/useProofreader';
import { useWritingHelper } from '@/modules/proofreading/hooks/useWritingHelper';
import { useNotes } from '@/modules/notes/hooks/useNotes';
import type { AssistantResult } from '@/modules/proofreading/types';
import { ErrorMessage } from '@/modules/aitutor/components/ui/ErrorMessage';
import { MainLayout } from '@/shared/components/layout/MainLayout';


export default function ProofreadingPage() {
  const editorRef = useRef<GrammarEditorRef>(null);
  const [content, setContent] = useState('');
  const [isEditable, setIsEditable] = useState(true);
  const [characterCount, setCharacterCount] = useState(0);
  
  const { result, loading, error, proofread, reset, clearError } = useProofreader();
  const { 
    result: writingHelperResult, 
    loading: writingHelperLoading, 
    error: writingHelperError, 
    generateHelp, 
    reset: resetWritingHelper,
    clearError: clearWritingHelperError 
  } = useWritingHelper();
  const { createNote } = useNotes();

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

  const handleSaveToNote = useCallback(async (title: string, proofreadingResult?: AssistantResult): Promise<boolean> => {
    if (!result?.correction) return false;
    
    try {
      // Create proofreading data if we have proofreading results
      let proofreading = undefined;
      if (proofreadingResult && result) {
        proofreading = {
          originalText: content, // Use the original content before proofreading
          correctedText: result.correction,
          edits: result.edits.map(edit => ({
            oldText: edit.oldText,
            newText: edit.newText,
            reason: edit.reasons.en
          })),
          suggestion: result.suggestion,
          correctionCount: result.edits.length
        };
      }
      
      const savedNote = createNote(result.correction, title, undefined, proofreading);
      if (savedNote) {
        console.log('[PROOFREAD_PAGE] Note saved successfully:', savedNote.id, 'with title:', title, proofreading ? 'and proofreading data' : '');
        return true;
      }
      return false;
    } catch (error) {
      console.error('[PROOFREAD_PAGE] Error saving note:', error);
      return false;
    }
  }, [result, createNote, content]);

  return (
    <MainLayout>
      <div className="mx-auto p-4 md:p-8 h-screen flex flex-col overflow-hidden">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            AI Writing & Proofreading Studio
          </h1>
          <p className="text-lg text-gray-600">
            Get writing assistance and proofread your text with AI-powered tools.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full overflow-hidden">
          {/* Left Panel - Writing & Proofreading */}
          <div className="space-y-6 h-full overflow-y-auto pb-8 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                📄 Your Writing Space
              </h2>
              
              {/* Error Message */}
              {error && (
                <ErrorMessage 
                  error={error}
                  onRetry={clearError}
                />
              )}

              {/* Main Editor Card */}
              <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden h-full">
                {/* Editor */}
                <div className="relative h-full">
                  {result ? (
                    <CorrectionTooltipWrapper 
                      edits={result.edits}
                      className="min-h-[400px] h-full"
                    >
                      <GrammarEditor
                        ref={editorRef}
                        initialContent={content}
                        editable={isEditable}
                        onUpdate={handleEditorUpdate}
                        placeholder="Start typing your text here..."
                        className="min-h-[400px] h-full"
                      />
                    </CorrectionTooltipWrapper>
                  ) : (
                    <GrammarEditor
                      ref={editorRef}
                      initialContent={content}
                      editable={isEditable}
                      onUpdate={handleEditorUpdate}
                      placeholder="Start typing your text here..."
                      className="min-h-[400px] h-full"
                    />
                  )}
                </div>

                {/* Actions */}
                <EditorActions
                  onProofread={handleProofread}
                  onReset={handleReset}
                  onCopy={handleCopy}
                  onEdit={handleEdit}
                  onSaveToNote={handleSaveToNote}
                  isLoading={loading}
                  isEditable={isEditable}
                  hasResult={!!result}
                  characterCount={characterCount}
                  proofreadingResult={result}
                />
              </div>

              {/* Suggestion */}
              {result?.suggestion && (
                <div className="mt-4">
                  <TextSuggestion
                    suggestion={result.suggestion}
                    onApply={handleApplySuggestion}
                  />
                </div>
              )}

              {/* Results Summary */}
              {result && (
                <div className="mt-4 bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Proofreading Results
                  </h3>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {result.edits.length}
                      </div>
                      <div className="text-gray-600">Corrections</div>
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

          {/* Right Panel - AI Writing Helper */}
          <div className="space-y-6 h-full overflow-y-auto pb-8 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            {/* Error Message for Writing Helper */}
            {writingHelperError && (
              <ErrorMessage 
                error={writingHelperError}
                onRetry={clearWritingHelperError}
              />
            )}

            {/* Writing Helper Form or Results */}
            {writingHelperResult ? (
              <WritingHelperResults 
                result={writingHelperResult}
                onReset={resetWritingHelper}
              />
            ) : (
              <WritingHelperForm
                onSubmit={generateHelp}
                loading={writingHelperLoading}
              />
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 