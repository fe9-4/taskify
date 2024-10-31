import { ChangeEventHandler, KeyboardEventHandler, MouseEventHandler } from "react";
import { inputFileSize } from "@/components/input/InputFile";

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
  readOnly?: boolean;
  onChange?: ChangeEventHandler;
  onKeyDown?: KeyboardEventHandler;
}

export interface textAreaProps {
  isTextArea?: boolean;
  isButton?: boolean;
}

export interface InputFileProps {
  label: string;
  id: string;
  name: string;
  value: string | File | null;
  size: Size;
  onChange: (file: File | null | string) => void;
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
  tags: string[];
  tagInput: string;
  onKeyDown: KeyboardEventHandler;
  onClick: (tag: string) => void;
  onChange: ChangeEventHandler;
}
