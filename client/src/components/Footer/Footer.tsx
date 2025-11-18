export default function Footer() {
  return (
    <footer className="w-full mt-10 border-t bg-background">
      <div className="mx-auto max-w-6xl px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Campus Connect — Todos os direitos reservados
        </p>

        <nav className="flex gap-6 text-sm text-muted-foreground">
          <a className="hover:text-primary transition" href="/sobre">Sobre</a>
          <a className="hover:text-primary transition" href="/privacidade">Privacidade</a>
          <a className="hover:text-primary transition" href="/contato">Contato</a>
        </nav>

      </div>
    </footer>
  );
}
