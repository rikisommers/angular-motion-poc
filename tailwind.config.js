/** @type {import('tailwindcss').Config} */
const customWidths = {
  'input-sm': 'var(--token-width-input-sm)',
  'input-md': 'var(--token-width-input-md)',
  'sidebar-collapsed': 'var(--token-width-sidebar-collapsed)',
  'sidebar': 'var(--token-width-sidebar)',
  'menu': 'var(--token-width-menu)',
  'panel-xs': 'var(--token-width-panel-xs)',
  'panel-sm': 'var(--token-width-panel-sm)',
  'panel-md': 'var(--token-width-panel-md)',
  'panel-lg': 'var(--token-width-panel-lg)',
  'panel-xl': 'var(--token-width-panel-xl)',
  'container': '800px',
};

const customHeights = {
  'input': 'var(--token-input-height)',
  'navbar': 'var(--token-height-navbar)',
  'header': 'var(--token-height-header)',
  '80vh': '80vh',
};

module.exports = {
  content: ['./src/**/*.{html,ts,tsx,jsx,js,css}'], // Adjust paths to match your Stencil project
  theme: {
    fontFamily: {
      sans: 'var(--token-font-family-base)',
    },
    spacing: {
      0: '0',
      2: '2px',
      4: '4px',
      8: '8px',
      12: '12px',
      16: '16px',
      20: '20px',
      22: '22px',
      24: '24px',
      30: '30px',
      32: '32px',
      40: '40px',
      48: '48px',
      50: '50px',
      64: '64px',
      72: '72px',
      80: '80px',
      100: '100px',
      120: '120px',
      180: '180px',
      220: '220px',
      340: '340px',
    },
    extend: {
      fontSize: {
        'h1': 'var(--token-font-size-h1)',
        'h2': 'var(--token-font-size-h2)',
        'h3': 'var(--token-font-size-h3)',
        'h4': 'var(--token-font-size-h4)',
        'h5': 'var(--token-font-size-h5)',
        'h6': 'var(--token-font-size-h6)',
        'body': 'var(--token-font-size-body)',
        'sm': 'var(--token-font-size-sm)',
        'xs': 'var(--token-font-size-xs)',
        'xl': 'var(--token-font-size-xl)',
        'button': 'var(--token-font-size-button)',
        'icon-sm': 'var(--token-font-size-icon-sm)',
        'icon-md': 'var(--token-font-size-icon-md)',
        'icon-lg': 'var(--token-font-size-icon-lg)',
        'icon-xl': 'var(--token-font-size-icon-xl)',
      },
      fontFamily: {
        base: 'var(--token-font-family-base)',
      },
      lineHeight: {
        reset: 1,
        normal: 'var(--token-line-height-base)',
        heading: 'var(--token-line-height-heading)',
        richtext: 'var(--token-line-height-richtext)',
      },
      fontWeight: {
        normal: 'var(--token-font-weight-light)',
        medium: 'var(--token-font-weight-med)',
        bold: 'var(--token-font-weight-bold)',
      },
      // TODO: add high contrast vairants for hover
      colors: {
        'success-base':
          'color-mix(in srgb, var(--token-state-success-base) calc(<alpha-value> * 100%), transparent)',
        'success-light':
          'color-mix(in srgb, var(--token-state-success-light) calc(<alpha-value> * 100%), transparent)',
        'success-dark':
          'color-mix(in srgb, var(--token-state-success-dark) calc(<alpha-value> * 100%), transparent)',
        'warning-base':
          'color-mix(in srgb, var(--token-state-warning-base) calc(<alpha-value> * 100%), transparent)',
        'warning-light':
          'color-mix(in srgb, var(--token-state-warning-light) calc(<alpha-value> * 100%), transparent)',
        'warning-dark':
          'color-mix(in srgb, var(--token-state-warning-dark) calc(<alpha-value> * 100%), transparent)',
        'error':
          'color-mix(in srgb, var(--token-state-error-dark) calc(<alpha-value> * 100%), transparent)',
        'error-base':
          'color-mix(in srgb, var(--token-state-error-base) calc(<alpha-value> * 100%), transparent)',
        'error-light':
          'color-mix(in srgb, var(--token-state-error-light) calc(<alpha-value> * 100%), transparent)',
        'error-dark':
          'color-mix(in srgb, var(--token-state-error-dark) calc(<alpha-value> * 100%), transparent)',
        'disabled-base':
          'color-mix(in srgb, var(--token-state-disabled-base) calc(<alpha-value> * 100%), transparent)',
        'disabled-light':
          'color-mix(in srgb, var(--token-state-disabled-light) calc(<alpha-value> * 100%), transparent)',
        'disabled-dark':
          'color-mix(in srgb, var(--token-state-disabled-dark) calc(<alpha-value> * 100%), transparent)',
        'active-base':
          'color-mix(in srgb, var(--token-state-active-base) calc(<alpha-value> * 100%), transparent)',
        'active-light':
          'color-mix(in srgb, var(--token-state-active-light) calc(<alpha-value> * 100%), transparent)',
        'active-dark':
          'color-mix(in srgb, var(--token-state-active-dark) calc(<alpha-value> * 100%), transparent)',
        'info-base':
          'color-mix(in srgb, var(--token-state-info-base) calc(<alpha-value> * 100%), transparent)',
        'info-light':
          'color-mix(in srgb, var(--token-state-info-light) calc(<alpha-value> * 100%), transparent)',
        'info-dark':
          'color-mix(in srgb, var(--token-state-info-dark) calc(<alpha-value> * 100%), transparent)',
        'focus-overlay-default':
          'color-mix(in srgb, var(--token-color-base-slate-500) calc(<alpha-value> * 100%), transparent)',
        'focus-overlay-primary':
          'color-mix(in srgb, var(--token-state-info-dark) calc(<alpha-value> * 100%), transparent)',
        'focus-overlay-destructive':
          'color-mix(in srgb, var(--token-state-error-dark) calc(<alpha-value> * 100%), transparent)',
        'primary': {
          foreground:
            'color-mix(in srgb, var(--token-state-info-foreground) calc(<alpha-value> * 100%), transparent)',
          DEFAULT:
            'color-mix(in srgb, var(--token-state-info-default) calc(<alpha-value> * 100%), transparent)',
        },
        'destructive': {
          foreground:
            'color-mix(in srgb, var(--token-state-error-foreground) calc(<alpha-value> * 100%), transparent)',
          DEFAULT:
            'color-mix(in srgb, var(--token-state-error-default) calc(<alpha-value> * 100%), transparent)',
        },
        'warning': {
          foreground:
            'color-mix(in srgb, var(--token-state-warning-foreground) calc(<alpha-value> * 100%), transparent)',
          DEFAULT:
            'color-mix(in srgb, var(--token-state-warning-default) calc(<alpha-value> * 100%), transparent)',
        },
        'success': {
          foreground:
            'color-mix(in srgb, var(--token-state-success-foreground) calc(<alpha-value> * 100%), transparent)',
          DEFAULT:
            'color-mix(in srgb, var(--token-state-success-default) calc(<alpha-value> * 100%), transparent)',
        },
        'active': {
          foreground:
            'color-mix(in srgb, var(--token-state-active-foreground) calc(<alpha-value> * 100%), transparent)',
          DEFAULT:
            'color-mix(in srgb, var(--token-state-active-dark) calc(<alpha-value> * 100%), transparent)',
        },
        'disabled': {
          foreground:
            'color-mix(in srgb, var(--token-state-disabled-foreground) calc(<alpha-value> * 100%), transparent)',
          DEFAULT:
            'color-mix(in srgb, var(--token-state-disabled-default) calc(<alpha-value> * 100%), transparent)',
        },
        'info': {
          foreground:
            'color-mix(in srgb, var(--token-state-info-foreground) calc(<alpha-value> * 100%), transparent)',
          DEFAULT:
            'color-mix(in srgb, var(--token-state-info-default) calc(<alpha-value> * 100%), transparent)',
        },
        'sidebar': {
          'background':
            'color-mix(in srgb, var(--token-sidebar-background) calc(<alpha-value> * 100%), transparent)',
          'foreground':
            'color-mix(in srgb, var(--token-sidebar-foreground) calc(<alpha-value> * 100%), transparent)',
          'primary':
            'color-mix(in srgb, var(--token-sidebar-primary) calc(<alpha-value> * 100%), transparent)',
          'primary-foreground':
            'color-mix(in srgb, var(--token-sidebar-primary-foreground) calc(<alpha-value> * 100%), transparent)',
          'sidebar-accent':
            'color-mix(in srgb, var(--token-sidebar-accent) calc(<alpha-value> * 100%), transparent)',
          'border':
            'color-mix(in srgb, var(--token-sidebar-border) calc(<alpha-value> * 100%), transparent)',
          'ring': 'color-mix(in srgb, var(--token-sidebar-ring) calc(<alpha-value> * 100%), transparent)',
        },
      },
      borderColor: {
        light: 'color-mix(in srgb, var(--token-border-light) calc(<alpha-value> * 100%), transparent)',
        med: 'color-mix(in srgb, var(--token-border-med) calc(<alpha-value> * 100%), transparent)',
        dark: 'color-mix(in srgb, var(--token-border-dark) calc(<alpha-value> * 100%), transparent)',
      },
      backgroundColor: {
        'surface-base':
          'color-mix(in srgb, var(--token-color-surface-base) calc(<alpha-value> * 100%), transparent)',
        'surface-0':
          'color-mix(in srgb, var(--token-color-surface-0) calc(<alpha-value> * 100%), transparent)',
        'surface-1':
          'color-mix(in srgb, var(--token-color-surface-1) calc(<alpha-value> * 100%), transparent)',
        'surface-2':
          'color-mix(in srgb, var(--token-color-surface-2) calc(<alpha-value> * 100%), transparent)',
        'surface-3':
          'color-mix(in srgb, var(--token-color-surface-3) calc(<alpha-value> * 100%), transparent)',
      },
      textColor: {
        dark: 'color-mix(in srgb, var(--token-text-dark) calc(<alpha-value> * 100%), transparent)',
        foreground:
          'color-mix(in srgb, var(--token-text-dark) calc(<alpha-value> * 100%), transparent)',
        med: 'color-mix(in srgb, var(--token-text-med) calc(<alpha-value> * 100%), transparent)',
        light: 'color-mix(in srgb, var(--token-text-light) calc(<alpha-value> * 100%), transparent)',
        error: 'color-mix(in srgb, var(--token-text-error) calc(<alpha-value> * 100%), transparent)',
        white: 'color-mix(in srgb, var(--token-color-white) calc(<alpha-value> * 100%), transparent)',
        impact: 'color-mix(in srgb, var(--token-color-white) calc(<alpha-value> * 100%), transparent)',
        disabled: {
          foreground:
            'color-mix(in srgb, var(--token-state-disabled-foreground) calc(<alpha-value> * 100%), transparent)',
          DEFAULT:
            'color-mix(in srgb, var(--token-text-disabled) calc(<alpha-value> * 100%), transparent)',
        },
      },
      height: {
        ...customHeights,
      },
      width: {
        ...customWidths,
      },
      maxWidth: {
        ...customWidths,
      },
      minWidth: {
        ...customWidths,
      },
      zIndex: {
        header: 'var(--token-z-index-header)',
        nav: 'var(--token-z-index-nav)',
        menu: 'var(--token-z-index-menu)',
        modal: 'var(--token-z-index-modal)',
      },
      shadow: {
        0: 'var(--token-shadow-0)',
        1: 'var(--token-shadow-1)',
        2: 'var(--token-shadow-2)',
        3: 'var(--token-shadow-3)',
      },
      flex: {
        fill: {
          display: 'flex',
          flexDirection: 'column',
          flex: '1 1 0%',
        },
      },
      flexCenter: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      },
    },
  },
  plugins: [],
};
