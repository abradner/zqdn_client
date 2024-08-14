import type { Meta, StoryObj } from '@storybook/react';

import GridsCanvas from '../components/GridsCanvas';

//👇 This default export determines where your story goes in the story list
const meta: Meta<typeof GridsCanvas> = {
  component: GridsCanvas,
};

export default meta;
type Story = StoryObj<typeof GridsCanvas>;

export const FirstStory: Story = {
  args: {
    //👇 The args you need here will depend on your component
  },
};