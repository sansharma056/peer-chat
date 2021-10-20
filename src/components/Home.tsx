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
				<h1 className="text-8xl text-center">peer chat</h1>
				<div className="mt-5">
					<Input
						placeholder="enter a room id"
						name="room-id"
						value={roomId}
						setValue={setRoomId}
					/>
				</div>
				<div className="mt-5">
					<Button value="Join Chat" onClick={handleClick} />
				</div>
			</div>
		</DocumentTitle>
	);
};

export default Home;
