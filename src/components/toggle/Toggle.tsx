type TToggleProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
};

const Toggle = ({ checked, onChange, label }: TToggleProps) => {
  return (
    <div className="relative mt-2">
      <button
        type="button"
        className="flex rounded-md bg-secondary text-text-secondary py-1.5 pr-2 pl-3 gap-2 text-left  sm:text-sm/6 border-border border-[1px] cursor-pointer"
        aria-haspopup="listbox"
        aria-expanded="true"
        aria-labelledby="listbox-label"
        onClick={() => onChange(!checked)}
      >
        <span>{label}</span>

        <input
          type="checkbox"
          checked={checked}
          className="size-3 self-center justify-self-end text-gray-500 "
        />
      </button>
    </div>
  );
};

export { Toggle };
