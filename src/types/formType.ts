export interface InputDateProps {
  label?: string;
  value: Date | null;
  placeholder?: string;
  onChange: (date: Date | null) => void;
}
