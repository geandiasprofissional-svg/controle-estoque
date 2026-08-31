import "../../styles/Card.css";

function Card({ titulo, valor }) {
    return (
        <div className="card">

            <h3>{titulo}</h3>

            <h2>{valor}</h2>

        </div>
    );
}

export default Card;