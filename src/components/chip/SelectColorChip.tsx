import ColorChip from "@/components/chip/ColorChip";
import { FieldValues, UseFormRegister, UseFormWatch } from "react-hook-form";
import { FaCheck } from "react-icons/fa6";

interface Props {
  register: UseFormRegister<FieldValues>;
  watch: UseFormWatch<FieldValues>;
}

const COLORS = [
  { value: "bg-green01", label: "Green", color: "#7AC555" },
  { value: "bg-purple01", label: "Purple", color: "#760DDE" },
  { value: "bg-orange01", label: "Orange", color: "#FFA500" },
  { value: "bg-blue01", label: "Blue", color: "#76A6EA" },
  { value: "bg-pink01", label: "Pink", color: "#E876EA" },
];

const SelectColorChip = ({ register, watch }: Props) => {
  const selectedColor = watch("color");

  return (
    <div className="flex gap-2">
      {COLORS.map((item) => (
        <label key={item.label} className="relative">
          <ColorChip color={item.value} />
          {selectedColor === item.color && <FaCheck className="absolute left-[3px] top-[3px] size-6 text-white" />}
          <input type="radio" {...register("color", { required: true })} value={item.color} className="hidden" />
        </label>
      ))}
    </div>
  );
};

export default SelectColorChip;
