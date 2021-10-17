import { ChangeEvent, Dispatch, SetStateAction } from "react";

type InputProps = {
	name: string;
	placeholder: string;
	value: string;
	setValue: Dispatch<SetStateAction<string>>;
};

const Input = ({ name, placeholder, value, setValue }: InputProps) => {
	function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
		setValue(e.target.value);
	}

	return (
		<input
			className="border-2 border-black"
			name={name}
			type="text"
			placeholder={placeholder}
			value={value}
			onChange={handleInputChange}
		/>
	);
};

export default Input;
