import type { Meta, StoryObj } from '@storybook/react';
import { DebugPanel } from './DebugPanel';

const meta = {
  title: 'Components/DebugPanel',
  component: DebugPanel,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    environment: { control: 'select', options: ['development', 'production'] },
    showInProduction: { control: 'boolean' },
    maxLogs: { control: 'number' },
  },
  decorators: [
    (Story) => (
      <div style={{ position: 'relative', height: '100vh' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DebugPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    environment: 'development',
    maxLogs: 2000,
    showInProduction: false,
  },
};

export const WithUser: Story = {
  args: {
    user: { id: 'user-123', email: 'test@example.com', role: 'admin' },
    environment: 'development',
    maxLogs: 2000,
  },
};

export const WithUploadEndpoint: Story = {
  args: {
    uploadEndpoint: 'https://api.example.com/logs/upload',
    environment: 'development',
    fileNameTemplate: '{env}_{date}_{time}_{userId}_{errorCount}errors',
  },
};

export const EmptyState: Story = {
  args: {
    maxLogs: 0,
    environment: 'development',
  },
};

export const ProductionMode: Story = {
  args: {
    environment: 'production',
    showInProduction: true,
    maxLogs: 2000,
  },
};

export const WithCustomFilename: Story = {
  args: {
    fileNameTemplate: 'debug_{env}_{userId}_{timestamp}',
    environment: 'development',
  },
};
