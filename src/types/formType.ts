import { ChangeEventHandler, KeyboardEventHandler, MouseEventHandler } from "react";
import { inputFileSize } from "@/components/input/InputFile";
import { CardProps } from "./cardType";

type Size = keyof typeof inputFileSize.size;

export interface InputProps extends textAreaProps {
  id?: string;
  label?: string;
  value?: string | never[];
  placeholder?: string;
  errors?: string;
  type?: string;
  name?: string;
  required?: boolean;
  autoComplete?: string;
  className?: string;
  tag?: string;
  size?: string;
  onChange?: ChangeEventHandler;
  onKeyDown?: KeyboardEventHandler;
}

export interface textAreaProps {
  isTextArea?: boolean;
  isButton?: boolean;
}

export interface InputFileProps extends InputProps {
  size: Size;
}

export interface InputDateProps {
  id: string;
  name: string;
  label: string;
  value: string | any;
  placeholder: string;
  onChange: (date: Date | null) => void;
}

export interface InputTagProps {
  cardData: CardProps;
  tagInput: string;
  onKeyDown: KeyboardEventHandler;
  onClick: (tagRemove: string) => void;
  onChange: ChangeEventHandler;
}
