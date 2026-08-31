import { FaBell, FaUserCircle } from "react-icons/fa";
import "../../styles/Header.css";

function Header() {
    return (
        <header className="header">

            <h2>Controle de Estoque</h2>

            <div className="header-right">

                <FaBell />

                <FaUserCircle />

            </div>

        </header>
    );
}

export default Header;