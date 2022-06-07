import { useState } from "react";

export const useToggle = (initial = false) => {
  const [toggled, setToggled] = useState(initial);
  const toggle = () => {
    setToggled((prevState) => !prevState);
  };
  return [toggled, toggle];
};
