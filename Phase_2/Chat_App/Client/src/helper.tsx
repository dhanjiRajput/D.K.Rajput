// helper.tsx
interface GetUserIconProps {
  name?: string;
  size: number;
}

export const GetUserIcon = ({ name = '', size }: GetUserIconProps) => {
  const firstLetter = name?.charAt(0)?.toUpperCase() || "?";
  const bgColor = "#6366f1"; // Indigo

  return (
    <div
      className="flex items-center justify-center rounded-full"
      style={{
        width: `${size * 4}px`,
        height: `${size * 4}px`,
        backgroundColor: bgColor,
        color: "white",
        fontSize: size * 2,
      }}
    >
      {firstLetter}
    </div>
  );
};
