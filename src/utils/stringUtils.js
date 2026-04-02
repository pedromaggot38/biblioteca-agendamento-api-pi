/**
 * Formata uma string para Title Case, ignorando preposições comuns.
 * Ex: "PEDRO DOS SANTOS" -> "Pedro dos Santos"
 * Ex: "informática para internet" -> "Informática para Internet"
 */
export const formatTitleCase = (str) => {
    if (!str) return '';
  
    const excecoes = ['de', 'da', 'do', 'das', 'dos', 'e', 'para', 'com'];
    
    return str
      .trim()
      .toLowerCase()
      .split(' ')
      .map((palavra, index) => {
        if (excecoes.includes(palavra) && index !== 0) {
          return palavra;
        }
        return palavra.charAt(0).toUpperCase() + palavra.slice(1);
      })
      .join(' ');
  };