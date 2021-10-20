type ButtonProps = {
	value: string;
	onClick: () => void;
};
const Button = ({ value, onClick: handleClick }: ButtonProps) => {
	return (
		<button
			className="p-2 w-max border-black border-2 hover:bg-gray-200 active:bg-gray-400"
			type="button"
			onClick={handleClick}
		>
			{value}
		</button>
	);
};

export default Button;
