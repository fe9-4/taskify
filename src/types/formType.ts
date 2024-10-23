import { inputFileSize } from "@/components/InputFile";

type Size = keyof typeof inputFileSize.size;

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
  readOnly?: boolean;
}

export interface textAreaProps {
  isTextArea?: boolean;
  isButton?: boolean;
}

export interface InputFileProps extends InputProps {
  size: Size;
}

export interface InputDateProps {
  label: string;
  value: string;
  placeholder: string;
  onChange: (date: Date | null) => void;
}
