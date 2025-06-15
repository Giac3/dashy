import React, { useState } from "react";
import { ClickAwayListener } from "../click-away-listener";
type TSelectProps<T extends string> = {
  placeHolder: string;
  label: string;
  selectedOption?: T;
  options: T[];
  renderOption?: (option: T) => React.ReactNode;
  onSelect: (option: T) => void;
};

const Select = <T extends string>({
  options,
  onSelect,
  renderOption,
  selectedOption,
  placeHolder,
  label,
}: TSelectProps<T>) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (option: T) => {
    onSelect(option);
    setOpen(false);
  };
  return (
    <>
      <div className="relative mt-2">
        <button
          onClick={() => setOpen(!open)}
          type="button"
          className="grid grid-cols-1 rounded-md bg-secondary text-text-secondary py-1.5 pr-2 pl-3 text-left outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 sm:text-sm/6 outline-none border-border border-[1px] cursor-pointer"
          aria-haspopup="listbox"
          aria-expanded="true"
          aria-labelledby="listbox-label"
        >
          <span className="col-start-1 row-start-1 flex items-center gap-3 pr-6">
            {label && selectedOption ? label + ": " : ""}
            {selectedOption
              ? renderOption
                ? renderOption(selectedOption)
                : selectedOption
              : placeHolder}
          </span>
          <svg
            className="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4"
            viewBox="0 0 16 16"
            fill="currentColor"
            aria-hidden="true"
            data-slot="icon"
          >
            <path
              fill-rule="evenodd"
              d="M5.22 10.22a.75.75 0 0 1 1.06 0L8 11.94l1.72-1.72a.75.75 0 1 1 1.06 1.06l-2.25 2.25a.75.75 0 0 1-1.06 0l-2.25-2.25a.75.75 0 0 1 0-1.06ZM10.78 5.78a.75.75 0 0 1-1.06 0L8 4.06 6.28 5.78a.75.75 0 0 1-1.06-1.06l2.25-2.25a.75.75 0 0 1 1.06 0l2.25 2.25a.75.75 0 0 1 0 1.06Z"
              clip-rule="evenodd"
            />
          </svg>
        </button>

        {open && (
          <ClickAwayListener onClickAway={() => setOpen(false)}>
            <div>
              <ul
                className="absolute z-10 mt-1 max-h-56 overflow-auto rounded-md bg-secondary text-base shadow-md shadow-primary ring-1 ring-black/5 focus:outline-hidden sm:text-sm border-border border-[1px]"
                tabIndex={-1}
                role="listbox"
              >
                {options.map((option, index) => (
                  <li
                    className="relative p-2 text-text-secondary select-none text-sm hover:bg-primary cursor-pointer"
                    role="option"
                    onClick={() => handleSelect(option)}
                    key={index}
                  >
                    {renderOption ? renderOption(option) : option}
                  </li>
                ))}
              </ul>
            </div>
          </ClickAwayListener>
        )}
      </div>
    </>
  );
};

export { Select };
