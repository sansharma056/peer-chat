type ButtonProps = {
	value: string;
	onClick: () => void;
};
const Button = ({ value, onClick: handleClick }: ButtonProps) => {
	return (
		<button type="button" onClick={handleClick}>
			{value}
		</button>
	);
};

export default Button;
