import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../components/Header/Header";
import "../styles/MainLayout.css";

function MainLayout({ children }) {
    return (
        <div className="layout">

            <Sidebar />

            <main className="content">

                <Header />

                {children}

            </main>

        </div>
    );
}

export default MainLayout;