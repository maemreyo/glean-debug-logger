import type { Meta, StoryObj } from '@storybook/react';
import { DebugPanelMinimal } from './DebugPanelMinimal';

const meta = {
  title: 'Components/DebugPanelMinimal',
  component: DebugPanelMinimal,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    fileNameTemplate: { control: 'text' },
  },
  decorators: [
    (Story) => (
      <div style={{ position: 'relative', height: '100vh' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DebugPanelMinimal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    fileNameTemplate: 'debug_{timestamp}',
  },
};

export const CustomFilename: Story = {
  args: {
    fileNameTemplate: 'logs_{env}_{date}_{time}',
  },
};
