import { useState } from "react";
import { useHistory } from "react-router-dom";
import Button from "./Button";
import Input from "./Input";

const Home = () => {
	const history = useHistory();
	const [roomId, setRoomId] = useState("");

	function handleClick() {
		history.push(roomId);
	}

	return (
		<div className="h-screen flex flex-col items-center justify-center">
			<Input
				placeholder="enter a room id"
				name="room-id"
				value={roomId}
				setValue={setRoomId}
			/>
			<Button value="Join Chat" onChange={handleClick} />
		</div>
	);
};

export default Home;
