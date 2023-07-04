export const bem = (block, element = "", modifier = "") => {
  let className = block;
  let auxClassName = "";
  if (element) {
    className += `__${element}`;
  }
  if (modifier) {
    className += `--${modifier}`;
  }

  if (block && element && modifier) {
    auxClassName = block + "__" + element + " " + className;
    className = auxClassName;
  }

  return className;
};
