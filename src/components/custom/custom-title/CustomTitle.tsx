interface Props {
  title: string;
  subTitle: string;
}

export const CustomTitle = ({ title, subTitle }: Props) => {
  return (
    <div>
      <h1 className="font-bold text-3xl">{title}</h1>
      <h3 className="text-xl font-medium">{subTitle}</h3>
    </div>
  );
};
