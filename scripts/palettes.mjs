// Atom's One syntax hues, with coordinated interface surfaces and readable UI text.
// Source and licensing details: NOTICE.md.
export const palettes = {
  light: {
    bg: '#fafafa', frame: '#e5e5e6', panel: '#f0f0f1', popup: '#ffffff',
    hover: '#e9e9eb', selected: '#dbe8fc', selectedStrong: '#cbdffc',
    line: '#f0f0f1', border: '#dedee1', borderStrong: '#b8b9bf',
    fg: '#383a42', strong: '#202227', secondary: '#565963', muted: '#696c77',
    subtle: '#848791', faint: '#a0a1a7', gutter: '#9d9fa8',
    accent: '#356ddb', accentHover: '#2e5fc4', onAccent: '#ffffff',
    link: '#3268d4', linkHover: '#2453b3',
    red: '#e45649', error: '#c43c35', green: '#50a14f', success: '#397b39',
    yellow: '#c18401', warning: '#916200', blue: '#4078f2',
    purple: '#a626a4', cyan: '#0184bc', orange: '#986801',
    comment: '#777983', selection: '#d7e5fb', selectionInactive: '#e6ebf3',
    guide: '#e2e2e5', guideActive: '#b3b5bd',
    infoBg: '#e7effc', infoBorder: '#9cb9ec',
    errorBg: '#fbe9e6', errorBorder: '#e5aaa3',
    warningBg: '#fbf1d6', warningBorder: '#d4b86d',
    successBg: '#e7f2e5', successBorder: '#a4c99d',
    search: '#f3e5ad', searchCurrent: '#e9ce73', searchFg: '#383a42',
    diffModified: '#e0ebfb', diffInserted: '#e3f0df', diffDeleted: '#f7e2df',
    diffModifiedStripe: '#9cb9ec', diffInsertedStripe: '#a2c89a', diffDeletedStripe: '#dfa59e',
    scrollbar: '#383a4233', scrollbarHover: '#383a4255',
    overlay: '#383a420b', overlayStrong: '#383a4218',
    shadow: '0 6px 20px rgba(32, 34, 39, 0.14)',
    dialogShadow: '0 0 0 1px rgba(32, 34, 39, 0.08), 0 16px 48px rgba(32, 34, 39, 0.18)',
    scrim: 'rgba(32, 34, 39, 0.28)',
    ansi: ['#383a42', '#c43c35', '#397b39', '#916200', '#3268d4', '#a626a4', '#0178a9', '#6a6c75',
      '#777983', '#c43c35', '#397b39', '#916200', '#3268d4', '#a626a4', '#0178a9', '#fafafa'],
  },
  dark: {
    bg: '#282c34', frame: '#21252b', panel: '#242830', popup: '#2c313a',
    hover: '#323842', selected: '#35465e', selectedStrong: '#405575',
    line: '#2c313a', border: '#353b45', borderStrong: '#4b5363',
    fg: '#abb2bf', strong: '#e5e9f0', secondary: '#a2aab8', muted: '#959eae',
    subtle: '#7f899a', faint: '#5c6370', gutter: '#636d80',
    accent: '#61afef', accentHover: '#80bff3', onAccent: '#21252b',
    link: '#61afef', linkHover: '#8ec9f8',
    red: '#e06c75', error: '#e06c75', green: '#98c379', success: '#98c379',
    yellow: '#e5c07b', warning: '#e5c07b', blue: '#61afef',
    purple: '#c678dd', cyan: '#56b6c2', orange: '#d19a66',
    comment: '#818b9c', selection: '#394459', selectionInactive: '#343c4b',
    guide: '#353b45', guideActive: '#596273',
    infoBg: '#2c3b50', infoBorder: '#435f85',
    errorBg: '#463038', errorBorder: '#87505a',
    warningBg: '#423a2e', warningBorder: '#8f7547',
    successBg: '#303e32', successBorder: '#597b48',
    search: '#5c4d2c', searchCurrent: '#806a36', searchFg: '#e5e9f0',
    diffModified: '#2c3b50', diffInserted: '#303e32', diffDeleted: '#463038',
    diffModifiedStripe: '#435f85', diffInsertedStripe: '#597b48', diffDeletedStripe: '#87505a',
    scrollbar: '#abb2bf33', scrollbarHover: '#abb2bf55',
    overlay: '#abb2bf10', overlayStrong: '#abb2bf24',
    shadow: '0 6px 20px rgba(0, 0, 0, 0.35)',
    dialogShadow: '0 0 0 1px rgba(0, 0, 0, 0.24), 0 16px 48px rgba(0, 0, 0, 0.45)',
    scrim: 'rgba(0, 0, 0, 0.45)',
    ansi: ['#282c34', '#e06c75', '#98c379', '#e5c07b', '#61afef', '#c678dd', '#56b6c2', '#abb2bf',
      '#818b9c', '#f08c95', '#b0d595', '#f0d49a', '#82c1f4', '#d99aeb', '#7dcbd4', '#e5e9f0'],
  },
};

// One role can supply several tokens; the output files remain ordinary editable JSON.
function roles(p, groups) {
  const tokens = {};
  for (const [role, names] of groups) {
    if (!(role in p)) throw new Error(`Unknown palette role: ${role}`);
    for (const name of names.split(' ')) {
      const key = `--${name}`;
      if (key in tokens) throw new Error(`Duplicate token: ${key}`);
      tokens[key] = p[role];
    }
  }
  return tokens;
}

export function makeTheme(kind) {
  const p = palettes[kind];
  const name = `Atom One ${kind === 'dark' ? 'Dark' : 'Light'}`;
  const ui = roles(p, [
    ['bg', 'bg-app bg-input bg-island bg-field bg-checkbox bg-toggle-off bg-dialog'],
    ['panel', 'bg-elev bg-control bg-tab-selected-inactive bg-popup-advertiser bg-progress-track'],
    ['popup', 'bg-popup bg-floating-toolbar bg-tooltip bg-stripe-tooltip bg-popup-inline'],
    ['frame', 'bg-frame bg-backdrop'],
    ['hover', 'bg-hover bg-control-hover bg-active bg-tree-selected-inactive'],
    ['selected', 'bg-selected bg-tree-selected bg-tab-selected bg-toolbar-selected bg-feedback-info'],
    ['selectedStrong', 'bg-selected-strong bg-toolbar-selected-hover'],
    ['line', 'bg-current-line'],
    ['infoBg', 'bg-debug-line'],
    ['border', 'border border-editor-tabs border-tooltip border-stripe-tooltip'],
    ['borderStrong', 'border-popup border-strong border-window control-off border-tab-selected-inactive border-button border-checkbox border-toggle bg-toggle-knob'],
    ['strong', 'fg-strong fg-emphasis'],
    ['fg', 'fg fg-icon fg-tooltip fg-stripe-tooltip'],
    ['secondary', 'fg-secondary fg-stripe-label'],
    ['muted', 'fg-muted'],
    ['subtle', 'fg-subtle fg-toggle-off'],
    ['faint', 'fg-faint'],
    ['gutter', 'fg-gutter'],
    ['accent', 'accent border-tab-selected focus-ring-soft bg-toggle-on'],
    ['link', 'link'], ['linkHover', 'link-hover'],
    ['red', 'chart-series vcs-deleted vcs-untracked vcs-conflict gutter-deleted'],
    ['error', 'danger'], ['warning', 'warning'], ['success', 'success db-connected db-connected-ring'],
    ['cyan', 'info'], ['blue', 'vcs-modified gutter-modified'],
    ['green', 'vcs-added gutter-added'], ['subtle', 'vcs-ignored'],
    ['diffModified', 'diff-modified'], ['diffInserted', 'diff-inserted'], ['diffDeleted', 'diff-deleted'],
    ['diffModifiedStripe', 'diff-modified-stripe'], ['diffInsertedStripe', 'diff-inserted-stripe'],
    ['diffDeletedStripe', 'diff-deleted-stripe diff-conflict-stripe'],
    ['shadow', 'shadow-popup shadow-tooltip shadow-stripe-tooltip shadow-balloon'], ['dialogShadow', 'shadow-dialog'],
    ['borderStrong', 'traffic-off'], ['border', 'traffic-off-border'],
    ['overlay', 'bg-stripe-hover bg-tab-hover bg-tree-hover bg-toolbar-hover'],
    ['overlayStrong', 'bg-stripe-selected bg-toolbar-pressed'],
    ['fg', 'fg-stripe-selected-active'], ['scrim', 'bg-scrim'],
    ['onAccent', 'fg-on-accent fg-button-primary fg-toggle-on'],
    ['accentHover', 'bg-button-primary-hover'],
    ['scrollbar', 'scrollbar-thumb'], ['scrollbarHover', 'scrollbar-thumb-hover'],
    ['search', 'bg-search-match'], ['searchCurrent', 'bg-search-match-current'], ['searchFg', 'fg-search-match'],
    ['infoBorder', 'border-feedback-info'],
    ['errorBg', 'bg-feedback-error'], ['errorBorder', 'border-feedback-error'],
    ['warningBg', 'bg-feedback-warning'], ['warningBorder', 'border-feedback-warning'],
    ['successBg', 'bg-feedback-success'], ['successBorder', 'border-feedback-success'],
    ['muted', 'bg-counter'], ['bg', 'fg-counter'],
  ]);
  Object.assign(ui, {
    '--bg-button': 'transparent',
    '--traffic-close': '#ff5f57', '--traffic-close-border': '#e0443e',
    '--traffic-close-pressed': '#bf4942', '--traffic-glyph': '#4d0000',
  });

  const editor = roles(p, [
    ['bg', 'bg-editor bg-editor-gutter'],
    ['fg', 'fg-editor syn-variable syn-global syn-namespace syn-param syn-punct syn-python-local-variable syn-python-global-variable syn-python-parentheses syn-python-brackets syn-python-braces'],
    ['purple', 'syn-keyword syn-annotation syn-decorator syn-self syn-predefined syn-python-predefined-definition syn-python-predefined-usage'],
    ['green', 'syn-string syn-docstring syn-markup-code syn-python-fstring syn-python-bytes'],
    ['blue', 'syn-function syn-function-call syn-python-nested-function syn-python-method-call syn-php-function-call syn-link syn-markup-heading'],
    ['yellow', 'syn-type syn-constant syn-python-class-attribute syn-python-constant syn-python-type-parameter syn-python-annotation syn-bracket-1'],
    ['orange', 'syn-number syn-attribute'],
    ['red', 'syn-property syn-tag syn-keyword-arg syn-python-instance-attribute syn-python-property syn-php-variable'],
    ['cyan', 'syn-builtin syn-escape syn-regexp syn-python-format syn-python-builtin syn-todo syn-bracket-3'],
    ['purple', 'syn-bracket-2'],
    ['comment', 'syn-comment syn-doc-comment syn-inline-value'],
    ['muted', 'syn-doc-comment-tag syn-doc-comment-tag-value syn-doc-markup syn-python-docstring-tag syn-python-docstring-keyword'],
    ['error', 'syn-invalid wave-error'], ['warning', 'wave-warning fg-bulb'], ['green', 'wave-typo'],
    ['blue', 'syn-rainbow-1'], ['cyan', 'syn-rainbow-2'], ['purple', 'syn-rainbow-3'],
    ['orange', 'syn-rainbow-4'], ['green', 'syn-rainbow-5'],
    ['accent', 'caret fg-completion-match'],
    ['gutter', 'fg-line-number'], ['secondary', 'fg-line-number-current'],
    ['bg', 'border-gutter'], ['guide', 'border-indent-guide border-right-margin'], ['guideActive', 'border-indent-guide-active'],
    ['selection', 'bg-editor-selection'], ['selectionInactive', 'bg-editor-selection-inactive'],
    ['search', 'bg-text-search-result bg-search-result'], ['searchCurrent', 'bg-text-search-result-current'],
    ['hover', 'bg-matched-brace bg-matched-tag bg-fold-placeholder bg-inlay bg-identifier-under-caret'],
    ['muted', 'fg-fold-placeholder fg-fold-marker fg-inlay'],
    ['guideActive', 'fg-whitespace'], ['subtle', 'fg-unused fg-weak-warning'], ['muted', 'fg-deprecated'],
    ['errorBg', 'bg-identifier-under-caret-write bg-breakpoint-line'],
    ['panel', 'bg-editor-inline'], ['infoBg', 'bg-editor-banner'],
  ]);
  Object.assign(editor, {
    '--syn-comment-style': 'italic',
    '--syn-doc-comment-tag-effect': 'none', '--syn-python-docstring-tag-effect': 'none',
    '--syn-doc-markup-bg': 'transparent', '--fg-editor-selection': 'inherit',
    '--matched-brace-weight': '700',
    '--editor-error-decoration': `underline wavy ${p.error}`,
    '--editor-warning-decoration': `underline wavy ${p.warning}`,
    '--editor-warning-background': 'transparent',
  });
  const ansiNames = ['black', 'red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white',
    'bright-black', 'bright-red', 'bright-green', 'bright-yellow', 'bright-blue', 'bright-magenta', 'bright-cyan', 'bright-white'];
  for (const [i, color] of ansiNames.entries()) {
    editor[`--ansi-${color}`] = p.ansi[i];
    editor[`--terminal-ansi-${color}`] = p.ansi[i];
  }
  return {
    theme: { id: `atom-one-${kind}`, name, kind, tokens: ui },
    scheme: { name, tokens: editor },
  };
}
