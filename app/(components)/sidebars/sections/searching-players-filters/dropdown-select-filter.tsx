import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import React from "react";

interface SearchPlayerFilterProps {
  stateValue: string;
  stateValueSetter?: React.Dispatch<React.SetStateAction<string>>;
  label: string;
  menuItemLabelToValueMap: Map<number|string, string>;
  containerStyle?:object
}

function DropDownSelectFilter({ stateValue, stateValueSetter, label, menuItemLabelToValueMap, containerStyle = {} }: SearchPlayerFilterProps) {
   
  const menuItemOptions:Array<JSX.Element> = [];
  menuItemLabelToValueMap.forEach((value, key) => {
    const menuItem = (
      <MenuItem key={key} divider dense value={key}>
        {value}
      </MenuItem>
    );
    menuItemOptions.push(menuItem);
  });

  const playerFilterLabelId = `${label.toLowerCase()}-player-filter-label`;

  const handleChange = (event: SelectChangeEvent) => {
    if(stateValueSetter) {
      stateValueSetter(event.target.value as string);
    }
  };
  return (
    <Box sx = {containerStyle}>
      <FormControl fullWidth>
        <InputLabel id={playerFilterLabelId}>{label}</InputLabel>
        <Select
          labelId={playerFilterLabelId}
          id={playerFilterLabelId}
          value={stateValue}
          label={label}
          onChange={handleChange}
          sx={{ maxHeight: "120px", overflowY: "auto" }}
          MenuProps={{
            PaperProps: {
              style: { maxHeight: "120px" },
            },
          }}
        >
          {menuItemOptions}
        </Select>
      </FormControl>
    </Box>
  );
}

export default DropDownSelectFilter;
