import { useParams, Link } from "react-router-dom";
import DocumentTitle from "react-document-title";

type RoomParams = {
	id: string;
};

const Room = () => {
	const { id } = useParams<RoomParams>();

	return (
		<DocumentTitle title="PeerChat - Room">
			<div>
				<h1>room id: {id}</h1>
				<Link to="/">Go back</Link>
			</div>
		</DocumentTitle>
	);
};

export default Room;
