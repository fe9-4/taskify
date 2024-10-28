import axios from "axios";
import { useParams } from "next/navigation";

const DetailCard = () => {
  const cardId = useParams();

  const getCard = async () => {
    const res = await axios.get(`/cards/${cardId}`);
  };
  return <section></section>;
};

export default DetailCard;
