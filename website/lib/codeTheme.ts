import css from '../styles/global.css';

const theme = {
  plain: {
    backgroundColor: css['colour-black'],
    color: css['colour-orange'],
  },
  styles: [
    {
      types: ['comment', 'prolog', 'doctype', 'cdata', 'punctuation'],
      style: {
        color: '#6c6783',
      },
    },
    {
      types: ['namespace'],
      style: {
        opacity: 0.7,
      },
    },
    {
      types: ['operator'],
      style: {
        color: css['colour-purple'],
      },
    },
    {
      types: ['number'],
      style: {
        color: css['colour-yellow'],
      },
    },
    {
      types: ['tag'],
      style: {
        color: css['colour-yellow'],
      },
    },
    {
      types: ['property', 'function'],
      style: {
        color: css['colour-blue'],
      },
    },
    {
      types: ['tag-id', 'selector', 'atrule-id'],
      style: {
        color: '#eeebff',
      },
    },
    {
      types: ['attr-name'],
      style: {
        color: css['colour-yellow-dark'],
      },
    },
    {
      types: ['string'],
      style: {
        color: css['colour-green'],
      },
    },
    {
      types: [
        'boolean',
        'entity',
        'url',
        'attr-value',
        'keyword',
        'control',
        'directive',
        'unit',
        'statement',
        'regex',
        'at-rule',
        'placeholder',
        'variable',
      ],
      style: {
        color: css['colour-pink'],
      },
    },
    {
      types: ['deleted'],
      style: {
        textDecorationLine: 'line-through',
      },
    },
    {
      types: ['inserted'],
      style: {
        textDecorationLine: 'underline',
      },
    },
    {
      types: ['italic'],
      style: {
        fontStyle: 'italic',
      },
    },
    {
      types: ['important', 'bold'],
      style: {
        fontWeight: 'bold',
      },
    },
    {
      types: ['important'],
      style: {
        color: '#c4b9fe',
      },
    },
  ],
};

export default theme;
