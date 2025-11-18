
// Formatar data de postagens
  export const convertDate = (created_at: string) => {
    const isoDate = created_at;
    const date = new Date(isoDate);

    const formatted = date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    return formatted;
  };