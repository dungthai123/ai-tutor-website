'use client';

import React, { useEffect, useImperativeHandle, forwardRef } from 'react';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import CharacterCount from '@tiptap/extension-character-count';
import { CorrectionMark } from '../editor/CorrectionMark';
import { cn } from '@/utils/helpers';

interface GrammarEditorProps {
  initialContent?: string;
  editable?: boolean;
  onUpdate?: (content: string) => void;
  className?: string;
  placeholder?: string;
}

export interface GrammarEditorRef {
  editor: Editor | null;
  getHTML: () => string;
  getText: () => string;
  getCharacterCount: () => number;
  setContent: (content: string) => void;
  setEditable: (editable: boolean) => void;
  focus: () => void;
  clear: () => void;
}

export const GrammarEditor = forwardRef<GrammarEditorRef, GrammarEditorProps>(
  ({ initialContent = '', editable = true, onUpdate, className, placeholder = 'Start typing your text here...' }, ref) => {
      const editor = useEditor({
    extensions: [
      StarterKit,
      CharacterCount,
      CorrectionMark.configure({
        HTMLAttributes: {
          class: 'correction-highlight',
        },
      }),
    ],
    content: initialContent,
    editable,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      if (onUpdate) {
        onUpdate(editor.getHTML());
      }
    },
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-sm sm:prose-base lg:prose-lg xl:prose-xl',
          'mx-auto my-4 p-4',
          'focus:outline-none',
          'min-h-[200px]',
          'max-w-none',
          className
        ),
        'data-placeholder': placeholder,
      },
    },
  });

    useImperativeHandle(ref, () => ({
      editor,
      getHTML: () => editor?.getHTML() || '',
      getText: () => editor?.getText() || '',
      getCharacterCount: () => editor?.storage.characterCount.characters() || 0,
      setContent: (content: string) => {
        editor?.commands.setContent(content);
      },
      setEditable: (editable: boolean) => {
        editor?.setEditable(editable);
      },
      focus: () => {
        editor?.commands.focus();
      },
      clear: () => {
        editor?.commands.clearContent();
      },
    }), [editor]);

    useEffect(() => {
      if (editor) {
        editor.setEditable(editable);
      }
    }, [editor, editable]);

    if (!editor) {
      return (
        <div className={cn(
          'min-h-[200px] p-4 border border-gray-200 rounded-lg',
          'flex items-center justify-center text-gray-500',
          className
        )}>
          Loading editor...
        </div>
      );
    }

    return (
      <div className={cn(
        'border border-gray-200 rounded-lg overflow-hidden',
        'bg-white shadow-sm',
        className
      )}>
        <EditorContent 
          editor={editor}
          className="prose-editor-content"
        />
      </div>
    );
  }
);

GrammarEditor.displayName = 'GrammarEditor'; 