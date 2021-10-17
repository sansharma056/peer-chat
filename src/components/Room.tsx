import { useParams, Link } from "react-router-dom";

type RoomParams = {
	id: string;
};

const Room = () => {
	const { id } = useParams<RoomParams>();

	return (
		<>
			<h1>room id: {id}</h1>
			<Link to="/">Go back</Link>
		</>
	);
};

export default Room;
