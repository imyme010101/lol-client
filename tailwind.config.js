/*
** TailwindCSS Configuration File
**
** Docs: https://tailwindcss.com/docs/configuration
** Default: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
*/
const colors = require('tailwindcss/colors')


module.exports = {
  theme: {
    customForms: theme => ({
      default: {
        checkbox: {
          width: theme('spacing.6'),
          height: theme('spacing.6'),
          backgroundColor: 'rgba(23, 49, 79, 0.6)',
          borderColor: theme('colors.indigo.800'),
          textColor: theme('colors.indigo.1000'),
          '&:focus': {
            backgroundColor: theme('colors.indigo.1000'),
            borderColor: theme('colors.indigo.700'),
            boxShadow: undefined
          },
          '&:checked': {
            backgroundColor: theme('colors.indigo.1000'),
            borderColor: 'transparent'
          }
        }
      }
    }),
    extend: {
      colors: {
        blue: colors.blue,
        teal: colors.teal,
        lime: colors.teal,
        sky: colors.sky,
        c: {
          0: '#151618',
          1: '#ff9600',
          2: '#f4f4f9',
          3: '#4e41db'
        }
      },
      spacing: {
        '2px': '2px',
        '3p5': '0.875rem',
        '4b': '1.15rem',
        '11': '2.75rem',
      },
      borderWidth: {
        '3': '3px',
      },
      fontFamily: {
        gong: ['GongGothicBold']
      },
      fontSize: {
        z: '0',
        xxs: '0.755rem'
      },
      height: {
        '200': '50rem',
        '1/2': '50%'
      },
      maxWidth: {
        '12': '3rem'
      },
      width: {
        '22': '5.5rem',
        '24': '6rem',
        '26': '6.5rem',
        '28': '7rem',
        '89': '22.5rem'
      },
      opacity: {
        '80': '0.80',
        '85': '0.85',
        '90': '0.90'
      }
    },
  },
  variants: {
    textColor: ['responsive', 'hover', 'focus', 'group-hover']
  },
  plugins: [
    require("@tailwindcss/forms")({
      strategy: 'base', // only generate global styles
      strategy: 'class', // only generate classes
    }),
  ],
  content: [
    `components/**/*.{vue,js}`,
    `layouts/**/*.vue`,
    `pages/**/*.vue`,
    `composables/**/*.{js,ts}`,
    `plugins/**/*.{js,ts}`,
    `App.{js,ts,vue}`,
    `app.{js,ts,vue}`
  ],

  future: {
    removeDeprecatedGapUtilities: true,
  },
}
