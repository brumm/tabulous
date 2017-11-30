import glamorous from 'glamorous'

export const Input = glamorous.input(({ theme }) => ({
  width: theme.listWidth,
  height: theme.listItemHeight,
  padding: 10,
  border: 'none',
}))

export const FancyShadow = glamorous.div({
  position: 'relative',
  overflow: 'visible',
  ':after': {
    content: '""',
    zIndex: 2,
    position: 'absolute',
    top: '100%',
    left: 0,
    width: '100%',
    height: 8,
    backgroundImage: `
      radial-gradient(
        farthest-side at 50% 0,
        rgba(44, 63, 83, 0.2),
        rgba(44, 63, 83, 0)
      ),
      radial-gradient(
        farthest-side at 50% 0,
        rgba(44, 63, 83, 0.1),
        rgba(44, 63, 83, 0.05)
      )
    `,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: '50% 0, 0 0',
    backgroundSize: '150% 8px, 100% 1px',
  },
})
