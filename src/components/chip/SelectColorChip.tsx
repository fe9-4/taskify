import ColorChip from "@/components/chip/ColorChip";
import { FieldValues, UseFormRegister, UseFormWatch } from "react-hook-form";
import { FaCheck } from "react-icons/fa6";

interface Props {
  register: UseFormRegister<FieldValues>;
  watch: UseFormWatch<FieldValues>;
}

const COLORS = [
  { value: "bg-green01", label: "Green" },
  { value: "bg-purple01", label: "Purple" },
  { value: "bg-orange01", label: "Orange" },
  { value: "bg-blue01", label: "Blue" },
  { value: "bg-pink01", label: "Pink" },
];

const SelectColorChip = ({ register, watch }: Props) => {
  const selectedColor = watch("color");

  return (
    <div className="flex gap-2">
      {COLORS.map((item) => (
        <label key={item.label} className="relative">
          <ColorChip color={item.value} />
          {/* 선택 됬을 경우 check 아이콘 표시 */}
          {selectedColor === item.value && <FaCheck className="absolute left-[3px] top-[3px] size-6 text-white" />}
          <input type="radio" {...register("color", { required: true })} value={item.value} className="hidden" />
        </label>
      ))}
    </div>
  );
};

export default SelectColorChip;
