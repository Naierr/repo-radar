import { useTheme } from '@mui/material/styles';
import type { Meta, StoryObj } from '@storybook/react-vite';

const meta = {
  title: 'Foundations/Colours',
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const Swatch: React.FC<{ name: string; value: string }> = ({ name, value }) => (
  <div style={{ alignItems: 'center', display: 'flex', gap: 12 }}>
    <span
      style={{
        background: value,
        border: '1px solid rgba(128,128,128,0.4)',
        borderRadius: 6,
        display: 'inline-block',
        height: 36,
        width: 36,
      }}
    />
    <code style={{ fontSize: '0.8rem' }}>{name}</code>
  </div>
);

const Group: React.FC<{ title: string; roles: [string, string][] }> = ({
  title,
  roles,
}) => (
  <section style={{ marginBottom: 28 }}>
    <h3 style={{ fontSize: '0.95rem', margin: '0 0 12px' }}>{title}</h3>
    <div style={{ display: 'grid', gap: 10 }}>
      {roles.map(([name, value]) => (
        <Swatch key={name} name={name} value={value} />
      ))}
    </div>
  </section>
);

const RoleSwatches: React.FC = () => {
  const { vars } = useTheme();
  const { palette } = vars;

  return (
    <div>
      <Group
        title="Canvas"
        roles={[
          ['canvas.default', palette.canvas.default],
          ['canvas.subtle', palette.canvas.subtle],
          ['canvas.inset', palette.canvas.inset],
          ['canvas.overlay', palette.canvas.overlay],
          ['canvas.hover', palette.canvas.hover],
        ]}
      />
      <Group
        title="Foreground"
        roles={[
          ['fg.default', palette.fg.default],
          ['fg.muted', palette.fg.muted],
          ['fg.subtle', palette.fg.subtle],
          ['fg.onEmphasis', palette.fg.onEmphasis],
        ]}
      />
      <Group
        title="Border"
        roles={[
          ['border.default', palette.border.default],
          ['border.muted', palette.border.muted],
        ]}
      />
      <Group
        title="Accent"
        roles={[
          ['accent.fg', palette.accent.fg],
          ['accent.emphasis', palette.accent.emphasis],
          ['accent.muted', palette.accent.muted],
          ['accent.subtle', palette.accent.subtle],
        ]}
      />
      <Group
        title="Tones"
        roles={[
          ['tone.success.fg', palette.tone.success.fg],
          ['tone.attention.fg', palette.tone.attention.fg],
          ['tone.danger.fg', palette.tone.danger.fg],
        ]}
      />
      <Group
        title="Brand gradient"
        roles={[
          ['gradient.from', palette.gradient.from],
          ['gradient.via', palette.gradient.via],
          ['gradient.to', palette.gradient.to],
        ]}
      />
    </div>
  );
};

/**
 * Product code never names a colour — it names a role, and the role resolves
 * per scheme. Flip the toolbar's theme and every swatch moves, because these
 * are CSS variables rather than values baked in at build time.
 */
export const SemanticRoles: Story = {
  render: () => <RoleSwatches />,
};
