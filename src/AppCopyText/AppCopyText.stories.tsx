import type { Meta, StoryObj } from "@storybook/react";
import AppCopyText, { TitlePositions } from "./AppCopyText";

const meta = {
  title: "Components/AppCopyText",
  component: AppCopyText,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    title: { control: "text" },
    content: { control: "text" },
    titlePosition: {
      control: "select",
      options: TitlePositions,
    },
  },
} satisfies Meta<typeof AppCopyText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: "Title",
    content: "Content to copy",
    titlePosition: "right",
    hideTitle: false,
  },
};
