type ButtonProps = {
	value: string;
	onChange: () => void;
};
const Button = ({ value, onChange: handleClick }: ButtonProps) => {
	return (
		<button type="button" onClick={handleClick}>
			{value}
		</button>
	);
};

export default Button;
