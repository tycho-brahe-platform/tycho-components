const limitCharacters = (attr: string, props: any, max: number) => {
  const value = props.row.original[attr];
  if (!value) return '';
  return value.length > max ? `${value.substr(0, max)}...` : value;
};

const addCenteredHeader = (header: string) => (
  <div className="text-center">{header}</div>
);

const addCenteredCell = (attr: string, props: any) => (
  <div className="text-center">{props.row.original[attr]}</div>
);

const addEnumBadge = (attr: string, props: any, append: string, t: any) => {
  const value = props[attr].toLowerCase();
  return (
    <span className={`badge badge-enum ${attr}-${value}`}>
      {t(`${append}${value}`)}
    </span>
  );
};

const addSimpleCell = (value: any) => {
  return <div className="text-center">{value}</div>;
};

const AppTableUtils = {
  limitCharacters,
  addCenteredHeader,
  addCenteredCell,
  addEnumBadge,
  addSimpleCell,
};

export default AppTableUtils;
