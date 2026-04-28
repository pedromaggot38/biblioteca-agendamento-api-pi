/**
 * Formata uma string para Title Case, ignorando preposições comuns.
 * Ex: "PEDRO DOS SANTOS" -> "Pedro dos Santos"
 * Ex: "informática para internet" -> "Informática para Internet"
 */
export const formatTitleCase = (str) => {
    if (!str) return '';
    const excecoes = ['de', 'da', 'do', 'das', 'dos', 'e', 'para', 'com'];
    const siglas = ['ETEC', 'TI', 'ADM', 'RM'];

    return str
      .trim()
      .split(' ')
      .map((palavra, index) => {
        const palavraLower = palavra.toLowerCase();
        if (siglas.includes(palavra.toUpperCase())) return palavra.toUpperCase();
        if (excecoes.includes(palavraLower) && index !== 0) return palavraLower;
        return palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase();
      })
      .join(' ');
};