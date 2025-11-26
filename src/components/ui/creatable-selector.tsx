import React from "react";
import MultipleSelector, { Option } from "@/components/ui/multiple-selector";

export const OPTIONS: Option[] = [];

const MultipleSelectorCreatable = () => {
  return (
    <div className="w-full px-10">
      <MultipleSelector
        defaultOptions={OPTIONS}
        placeholder="Type something that does not exist in dropdowns..."
        creatable
        emptyIndicator={
          <p className="text-center text-lg leading-10 text-gray-600 dark:text-gray-400">
            no results found.
          </p>
        }
      />
    </div>
  );
};

export default MultipleSelectorCreatable;
