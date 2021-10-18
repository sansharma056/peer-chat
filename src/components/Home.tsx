import { useState } from "react";
import { useHistory } from "react-router-dom";
import DocumentTitle from "react-document-title";
import Button from "./Button";
import Input from "./Input";

const Home = () => {
	const history = useHistory();
	const [roomId, setRoomId] = useState("");

	function handleClick() {
		history.push(roomId);
	}

	return (
		<DocumentTitle title="PeerChat - Home">
			<div className="h-screen flex flex-col items-center justify-center">
				<Input
					placeholder="enter a room id"
					name="room-id"
					value={roomId}
					setValue={setRoomId}
				/>
				<Button value="Join Chat" onChange={handleClick} />
			</div>
		</DocumentTitle>
	);
};

export default Home;
