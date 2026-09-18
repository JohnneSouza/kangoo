export type Locale = "en-US" | "pt-BR";

export const localeNames: Record<Locale, string> = {
  "en-US": "English (US)",
  "pt-BR": "Português (BR)",
};

export interface ToolCopy {
  name: string;
  description: string;
  keywords: string;
}

export interface Translation {
  common: {
    appName: string;
    appTagline: string;
    searchPlaceholder: string;
    searchShortcut: string;
    noResults: string;
    allTools: string;
    home: string;
    homeTitle: string;
    homeSubtitle: string;
    homeSearchHint: string;
    themeLight: string;
    themeDark: string;
    language: string;
    copy: string;
    copied: string;
    clear: string;
    paste: string;
    download: string;
    sample: string;
    swap: string;
    input: string;
    output: string;
    settings: string;
    about: string;
    tips: string;
    footerText: string;
    viewOnGithub: string;
    categoriesLabel: string;
    toolCount: string;
    encode: string;
    decode: string;
    generate: string;
    error: string;
    valid: string;
    invalid: string;
    charactersLabel: string;
    wordsLabel: string;
    linesLabel: string;
  };
  categories: Record<string, string>;
  tools: Record<string, ToolCopy>;
}

export const translations: Record<Locale, Translation> = {
  "en-US": {
    common: {
      appName: "DevToolbox",
      appTagline: "Developer Tools Reference",
      searchPlaceholder: "Search tools... (e.g. base64, uuid, json)",
      searchShortcut: "/",
      noResults: "No tools found",
      allTools: "All tools",
      home: "Overview",
      homeTitle: "Everything you need, in one toolbox.",
      homeSubtitle:
        "A fast, offline-friendly collection of everyday developer utilities — encoders, converters, generators and formatters — built for a clean, distraction-free workflow.",
      homeSearchHint: "Press / to search, or browse categories on the left.",
      themeLight: "Light",
      themeDark: "Dark",
      language: "Language",
      copy: "Copy",
      copied: "Copied!",
      clear: "Clear",
      paste: "Paste",
      download: "Download",
      sample: "Load sample",
      swap: "Swap",
      input: "Input",
      output: "Output",
      settings: "Settings",
      about: "About this tool",
      tips: "Tips",
      footerText: "Built for developers. Runs entirely in your browser — nothing is sent to a server.",
      viewOnGithub: "View source",
      categoriesLabel: "Categories",
      toolCount: "tools",
      encode: "Encode",
      decode: "Decode",
      generate: "Generate",
      error: "Error",
      valid: "Valid",
      invalid: "Invalid",
      charactersLabel: "Characters",
      wordsLabel: "Words",
      linesLabel: "Lines",
    },
    categories: {
      encoding: "Encoding & Decoding",
      generators: "Generators",
      converters: "Converters",
      formatters: "Formatters & Validators",
      text: "Text Tools",
    },
    tools: {
      base64: {
        name: "Base64 Encode / Decode",
        description: "Convert text to and from Base64 encoding instantly.",
        keywords: "base64 encode decode binary ascii",
      },
      "url-encode": {
        name: "URL Encode / Decode",
        description: "Percent-encode or decode URI components and query strings.",
        keywords: "url uri encode decode percent escape query string",
      },
      "html-entities": {
        name: "HTML Entity Encode / Decode",
        description: "Escape or unescape HTML special characters and entities.",
        keywords: "html entities escape unescape xss special characters",
      },
      "jwt-decoder": {
        name: "JWT Decoder",
        description: "Decode JSON Web Tokens and inspect header and payload.",
        keywords: "jwt json web token decode header payload auth",
      },
      "uuid-generator": {
        name: "UUID Generator",
        description: "Generate v4 UUIDs / GUIDs in bulk, with custom formatting.",
        keywords: "uuid guid generator unique identifier v4",
      },
      "password-generator": {
        name: "Password Generator",
        description: "Create strong, random passwords with custom rules.",
        keywords: "password generator random secure strong",
      },
      "lorem-ipsum": {
        name: "Lorem Ipsum Generator",
        description: "Generate placeholder text by words, sentences or paragraphs.",
        keywords: "lorem ipsum placeholder dummy text generator",
      },
      "hash-generator": {
        name: "Hash Generator",
        description: "Compute MD5, SHA-1, SHA-256 and SHA-512 hashes of any text.",
        keywords: "hash md5 sha1 sha256 sha512 checksum digest",
      },
      "number-base": {
        name: "Number Base Converter",
        description: "Convert numbers between binary, octal, decimal and hexadecimal.",
        keywords: "number base binary octal decimal hexadecimal converter",
      },
      "color-converter": {
        name: "Color Converter",
        description: "Convert colors between HEX, RGB, HSL and preview them live.",
        keywords: "color converter hex rgb hsl picker css",
      },
      "timestamp-converter": {
        name: "Timestamp Converter",
        description: "Convert between Unix timestamps and human-readable dates.",
        keywords: "timestamp unix epoch date time converter iso",
      },
      "case-converter": {
        name: "Text Case Converter",
        description: "Convert text to camelCase, snake_case, kebab-case and more.",
        keywords: "case converter camel snake kebab pascal upper lower title",
      },
      "json-formatter": {
        name: "JSON Formatter & Validator",
        description: "Format, minify and validate JSON documents.",
        keywords: "json formatter validator minify pretty print beautify",
      },
      "regex-tester": {
        name: "Regex Tester",
        description: "Test regular expressions against sample text with live matches.",
        keywords: "regex regexp regular expression tester match",
      },
      "diff-checker": {
        name: "Text Diff Checker",
        description: "Compare two blocks of text and highlight the differences.",
        keywords: "diff compare text difference checker merge",
      },
      "markdown-preview": {
        name: "Markdown Previewer",
        description: "Write Markdown and preview the rendered HTML side by side.",
        keywords: "markdown preview render html md",
      },
      slugify: {
        name: "Slug Generator",
        description: "Turn any text into a clean, URL-friendly slug.",
        keywords: "slug slugify url friendly seo dash",
      },
      "word-counter": {
        name: "Word & Character Counter",
        description: "Count words, characters, sentences and reading time.",
        keywords: "word character counter count reading time sentence",
      },
    },
  },
  "pt-BR": {
    common: {
      appName: "DevToolbox",
      appTagline: "Referência de Ferramentas para Devs",
      searchPlaceholder: "Buscar ferramentas... (ex. base64, uuid, json)",
      searchShortcut: "/",
      noResults: "Nenhuma ferramenta encontrada",
      allTools: "Todas as ferramentas",
      home: "Visão geral",
      homeTitle: "Tudo que você precisa, em uma caixa de ferramentas.",
      homeSubtitle:
        "Uma coleção rápida e offline de utilitários do dia a dia — codificadores, conversores, geradores e formatadores — feita para um fluxo de trabalho limpo e sem distrações.",
      homeSearchHint: "Pressione / para buscar, ou navegue pelas categorias à esquerda.",
      themeLight: "Claro",
      themeDark: "Escuro",
      language: "Idioma",
      copy: "Copiar",
      copied: "Copiado!",
      clear: "Limpar",
      paste: "Colar",
      download: "Baixar",
      sample: "Carregar exemplo",
      swap: "Inverter",
      input: "Entrada",
      output: "Saída",
      settings: "Configurações",
      about: "Sobre esta ferramenta",
      tips: "Dicas",
      footerText: "Feito para desenvolvedores. Roda inteiramente no navegador — nada é enviado a um servidor.",
      viewOnGithub: "Ver código-fonte",
      categoriesLabel: "Categorias",
      toolCount: "ferramentas",
      encode: "Codificar",
      decode: "Decodificar",
      generate: "Gerar",
      error: "Erro",
      valid: "Válido",
      invalid: "Inválido",
      charactersLabel: "Caracteres",
      wordsLabel: "Palavras",
      linesLabel: "Linhas",
    },
    categories: {
      encoding: "Codificação",
      generators: "Geradores",
      converters: "Conversores",
      formatters: "Formatadores & Validadores",
      text: "Ferramentas de Texto",
    },
    tools: {
      base64: {
        name: "Codificar / Decodificar Base64",
        description: "Converta texto de e para Base64 instantaneamente.",
        keywords: "base64 codificar decodificar binario ascii",
      },
      "url-encode": {
        name: "Codificar / Decodificar URL",
        description: "Codifique ou decodifique componentes de URI e query strings.",
        keywords: "url uri codificar decodificar percent escape query string",
      },
      "html-entities": {
        name: "Entidades HTML",
        description: "Escape ou remova o escape de caracteres especiais HTML.",
        keywords: "html entidades escape unescape xss caracteres especiais",
      },
      "jwt-decoder": {
        name: "Decodificador de JWT",
        description: "Decodifique JSON Web Tokens e inspecione header e payload.",
        keywords: "jwt json web token decodificar header payload auth",
      },
      "uuid-generator": {
        name: "Gerador de UUID",
        description: "Gere UUIDs / GUIDs v4 em lote, com formatação customizada.",
        keywords: "uuid guid gerador identificador unico v4",
      },
      "password-generator": {
        name: "Gerador de Senhas",
        description: "Crie senhas fortes e aleatórias com regras customizadas.",
        keywords: "senha gerador aleatorio seguro forte password",
      },
      "lorem-ipsum": {
        name: "Gerador de Lorem Ipsum",
        description: "Gere texto de preenchimento por palavras, frases ou parágrafos.",
        keywords: "lorem ipsum texto fake preenchimento gerador",
      },
      "hash-generator": {
        name: "Gerador de Hash",
        description: "Calcule hashes MD5, SHA-1, SHA-256 e SHA-512 de qualquer texto.",
        keywords: "hash md5 sha1 sha256 sha512 checksum digest",
      },
      "number-base": {
        name: "Conversor de Base Numérica",
        description: "Converta números entre binário, octal, decimal e hexadecimal.",
        keywords: "numero base binario octal decimal hexadecimal conversor",
      },
      "color-converter": {
        name: "Conversor de Cores",
        description: "Converta cores entre HEX, RGB, HSL e visualize ao vivo.",
        keywords: "cor conversor hex rgb hsl seletor css",
      },
      "timestamp-converter": {
        name: "Conversor de Timestamp",
        description: "Converta entre timestamps Unix e datas legíveis.",
        keywords: "timestamp unix epoch data hora conversor iso",
      },
      "case-converter": {
        name: "Conversor de Case",
        description: "Converta texto para camelCase, snake_case, kebab-case e mais.",
        keywords: "case conversor camel snake kebab pascal maiusculo minusculo titulo",
      },
      "json-formatter": {
        name: "Formatador & Validador de JSON",
        description: "Formate, minifique e valide documentos JSON.",
        keywords: "json formatador validador minificar embelezar",
      },
      "regex-tester": {
        name: "Testador de Regex",
        description: "Teste expressões regulares em um texto de exemplo com resultados ao vivo.",
        keywords: "regex regexp expressao regular testador match",
      },
      "diff-checker": {
        name: "Comparador de Textos",
        description: "Compare dois blocos de texto e destaque as diferenças.",
        keywords: "diff comparar texto diferenca checker merge",
      },
      "markdown-preview": {
        name: "Visualizador de Markdown",
        description: "Escreva Markdown e veja o HTML renderizado lado a lado.",
        keywords: "markdown preview renderizar html md",
      },
      slugify: {
        name: "Gerador de Slug",
        description: "Transforme qualquer texto em um slug limpo e amigável para URLs.",
        keywords: "slug slugify url amigavel seo traco",
      },
      "word-counter": {
        name: "Contador de Palavras",
        description: "Conte palavras, caracteres, frases e tempo de leitura.",
        keywords: "palavra caractere contador contagem tempo leitura frase",
      },
    },
  },
};
