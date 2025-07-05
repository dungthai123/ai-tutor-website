import { Mark } from '@tiptap/core';

export const CorrectionMark = Mark.create({
  name: 'correction',
  
  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      'data-edit-index': {
        default: null,
        parseHTML: (element) => element.getAttribute('data-edit-index'),
        renderHTML: (attributes) => {
          if (!attributes['data-edit-index']) {
            return {};
          }
          return {
            'data-edit-index': attributes['data-edit-index'],
          };
        },
      },
      'data-correction': {
        default: 'true',
        parseHTML: (element) => element.getAttribute('data-correction'),
        renderHTML: (attributes) => {
          return {
            'data-correction': attributes['data-correction'],
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-correction]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'span',
      {
        ...this.options.HTMLAttributes,
        ...HTMLAttributes,
        class: 'correction-highlight',
        'data-correction': 'true',
      },
      0,
    ];
  },
}); 