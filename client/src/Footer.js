export default function Footer() {
    const currentYear = new Date().getFullYear(); // Obtém o ano atual

    return (
        <div>
            <div className="footer-top-space mt-3"></div>
        <footer className="footer">
            &copy; {currentYear} Palmeiras Porto. Todos os direitos reservados.
        </footer>
        </div>
    );
}
