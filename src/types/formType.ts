import { ChangeEventHandler } from "react";
import { inputFileSize } from "@/components/InputFile";

export interface InputProps extends textAreaProps {
  id?: string;
  label?: string;
  value?: string;
  placeholder?: string;
  errors?: string;
  type?: string;
  name?: string;
  required?: boolean;
  autoComplete?: string;
  className?: string;
}

export interface textAreaProps {
  isTextArea?: boolean;
  inputButton?: boolean;
}

export interface InputFileProps {
  label?: string;
  name?: string;
  value?: string;
  size: Size;
  onChange?: ChangeEventHandler;
}

type Size = keyof typeof inputFileSize.size;
