import {
    FaBoxOpen,
    FaTruck,
    FaHome,
    FaLink,
    FaExchangeAlt
} from "react-icons/fa";

import { NavLink } from "react-router-dom";

import "../../styles/Sidebar.css";

function Sidebar() {

    return (
        <aside className="sidebar">

            <h2>Estoque</h2>

            <nav>

                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        isActive ? "menu-ativo" : ""
                    }
                >
                    <FaHome />
                    Dashboard
                </NavLink>


                <NavLink
                    to="/produtos"
                    className={({ isActive }) =>
                        isActive ? "menu-ativo" : ""
                    }
                >
                    <FaBoxOpen />
                    Produtos
                </NavLink>


                <NavLink
                    to="/fornecedores"
                    className={({ isActive }) =>
                        isActive ? "menu-ativo" : ""
                    }
                >
                    <FaTruck />
                    Fornecedores
                </NavLink>


                <NavLink
                    to="/relacionamentos"
                    className={({ isActive }) =>
                        isActive ? "menu-ativo" : ""
                    }
                >
                    <FaLink />
                    Relacionamentos
                </NavLink>


                <NavLink
                    to="/movimentacoes"
                    className={({ isActive }) =>
                        isActive ? "menu-ativo" : ""
                    }
                >
                    <FaExchangeAlt />
                    Movimentações
                </NavLink>

            </nav>

        </aside>
    );
}

export default Sidebar;