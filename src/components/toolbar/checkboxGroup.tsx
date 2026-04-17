type CheckboxGroupProps = {
  title: string;
  items: { key: string; label: string }[];
  selected: string[];
  onChange: (key: string) => void;
};

const CheckboxGroup = ({
  title,
  items,
  selected,
  onChange,
}: CheckboxGroupProps) => (
  <div className="flex flex-col">
    <h4 className="mr-5 font-bold">{title}</h4>
    <div className="flex flex-col gap-4 md:flex-row">
      {items.map((item) => (
        <label key={item.key} className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={selected.includes(item.key)}
            onChange={() => onChange(item.key)}
          />
          {item.label}
        </label>
      ))}
    </div>
  </div>
);

export default CheckboxGroup;
