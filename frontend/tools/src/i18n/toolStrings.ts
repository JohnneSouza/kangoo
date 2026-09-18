import type { Locale } from "./translations";

export const toolStrings: Record<Locale, Record<string, string>> = {
  "en-US": {
    "base64.urlSafe": "URL-safe alphabet",
    "base64.placeholder": "Type or paste text here...",
    "base64.invalid": "Unable to decode — input is not valid Base64.",

    "urlEncode.component": "encodeURIComponent",
    "urlEncode.full": "encodeURI (full URL)",
    "urlEncode.invalid": "Unable to decode — malformed percent-encoding.",

    "htmlEntities.placeholder": "<div class=\"hero\">Hello & welcome!</div>",

    "jwt.header": "Header",
    "jwt.payload": "Payload",
    "jwt.signature": "Signature (not verified)",
    "jwt.invalid": "This does not look like a valid JWT (expected 3 dot-separated parts).",
    "jwt.issuedAt": "Issued at",
    "jwt.expiresAt": "Expires at",
    "jwt.expired": "Expired",
    "jwt.notExpired": "Valid",
    "jwt.placeholder": "Paste a JWT, e.g. eyJhbGciOi...",

    "uuid.quantity": "Quantity",
    "uuid.uppercase": "Uppercase",
    "uuid.hyphens": "Hyphens",
    "uuid.braces": "Wrap in braces",
    "uuid.generate": "Generate",

    "password.length": "Length",
    "password.uppercase": "Uppercase letters (A-Z)",
    "password.lowercase": "Lowercase letters (a-z)",
    "password.numbers": "Numbers (0-9)",
    "password.symbols": "Symbols (!@#$...)",
    "password.excludeAmbiguous": "Exclude ambiguous characters",
    "password.strength": "Strength",
    "password.weak": "Weak",
    "password.fair": "Fair",
    "password.good": "Good",
    "password.strong": "Strong",
    "password.regenerate": "Regenerate",
    "password.noCharset": "Select at least one character set.",

    "lorem.unit": "Generate by",
    "lorem.paragraphs": "Paragraphs",
    "lorem.sentences": "Sentences",
    "lorem.words": "Words",
    "lorem.count": "Amount",
    "lorem.startWithLorem": "Start with \"Lorem ipsum dolor sit amet\"",

    "hash.algorithm": "Algorithm",
    "hash.placeholder": "Type text to hash...",

    "numberBase.decimal": "Decimal",
    "numberBase.binary": "Binary",
    "numberBase.octal": "Octal",
    "numberBase.hex": "Hexadecimal",
    "numberBase.invalid": "Invalid number for the selected base.",

    "color.hex": "HEX",
    "color.rgb": "RGB",
    "color.hsl": "HSL",
    "color.invalid": "Unrecognized color format.",
    "color.preview": "Preview",

    "timestamp.unixSeconds": "Unix timestamp (seconds)",
    "timestamp.unixMillis": "Unix timestamp (ms)",
    "timestamp.iso": "ISO 8601 (UTC)",
    "timestamp.local": "Local date & time",
    "timestamp.now": "Use current time",
    "timestamp.invalid": "Invalid date or timestamp.",
    "timestamp.relative": "Relative",

    "json.indentSize": "Indent size",
    "json.format": "Format",
    "json.minify": "Minify",
    "json.validJson": "Valid JSON",
    "json.invalidJson": "Invalid JSON",
    "json.placeholder": "{\n  \"paste\": \"your JSON here\"\n}",

    "regex.pattern": "Pattern",
    "regex.flags": "Flags",
    "regex.testString": "Test string",
    "regex.matches": "matches",
    "regex.noMatches": "No matches found.",
    "regex.invalid": "Invalid regular expression.",

    "diff.original": "Original",
    "diff.changed": "Changed",
    "diff.noDiff": "The two texts are identical.",
    "diff.summary": "changes",

    "markdown.editor": "Markdown",
    "markdown.preview": "Preview",
    "markdown.placeholder": "# Hello world\n\nWrite some **Markdown** here.",

    "slugify.separator": "Separator",
    "slugify.lowercase": "Force lowercase",
    "slugify.placeholder": "My Awesome Blog Post Title!",

    "wordCounter.sentences": "Sentences",
    "wordCounter.readingTime": "Reading time",
    "wordCounter.minutes": "min",
    "wordCounter.placeholder": "Start typing or paste your text...",
  },
  "pt-BR": {
    "base64.urlSafe": "Alfabeto seguro para URL",
    "base64.placeholder": "Digite ou cole o texto aqui...",
    "base64.invalid": "Não foi possível decodificar — entrada não é Base64 válida.",

    "urlEncode.component": "encodeURIComponent",
    "urlEncode.full": "encodeURI (URL completa)",
    "urlEncode.invalid": "Não foi possível decodificar — percent-encoding inválido.",

    "htmlEntities.placeholder": "<div class=\"hero\">Olá & bem-vindo!</div>",

    "jwt.header": "Cabeçalho",
    "jwt.payload": "Payload",
    "jwt.signature": "Assinatura (não verificada)",
    "jwt.invalid": "Isso não parece um JWT válido (esperado 3 partes separadas por ponto).",
    "jwt.issuedAt": "Emitido em",
    "jwt.expiresAt": "Expira em",
    "jwt.expired": "Expirado",
    "jwt.notExpired": "Válido",
    "jwt.placeholder": "Cole um JWT, ex. eyJhbGciOi...",

    "uuid.quantity": "Quantidade",
    "uuid.uppercase": "Maiúsculas",
    "uuid.hyphens": "Hífens",
    "uuid.braces": "Envolver em chaves",
    "uuid.generate": "Gerar",

    "password.length": "Comprimento",
    "password.uppercase": "Letras maiúsculas (A-Z)",
    "password.lowercase": "Letras minúsculas (a-z)",
    "password.numbers": "Números (0-9)",
    "password.symbols": "Símbolos (!@#$...)",
    "password.excludeAmbiguous": "Excluir caracteres ambíguos",
    "password.strength": "Força",
    "password.weak": "Fraca",
    "password.fair": "Razoável",
    "password.good": "Boa",
    "password.strong": "Forte",
    "password.regenerate": "Gerar novamente",
    "password.noCharset": "Selecione ao menos um conjunto de caracteres.",

    "lorem.unit": "Gerar por",
    "lorem.paragraphs": "Parágrafos",
    "lorem.sentences": "Frases",
    "lorem.words": "Palavras",
    "lorem.count": "Quantidade",
    "lorem.startWithLorem": "Começar com \"Lorem ipsum dolor sit amet\"",

    "hash.algorithm": "Algoritmo",
    "hash.placeholder": "Digite o texto para gerar o hash...",

    "numberBase.decimal": "Decimal",
    "numberBase.binary": "Binário",
    "numberBase.octal": "Octal",
    "numberBase.hex": "Hexadecimal",
    "numberBase.invalid": "Número inválido para a base selecionada.",

    "color.hex": "HEX",
    "color.rgb": "RGB",
    "color.hsl": "HSL",
    "color.invalid": "Formato de cor não reconhecido.",
    "color.preview": "Pré-visualização",

    "timestamp.unixSeconds": "Timestamp Unix (segundos)",
    "timestamp.unixMillis": "Timestamp Unix (ms)",
    "timestamp.iso": "ISO 8601 (UTC)",
    "timestamp.local": "Data e hora local",
    "timestamp.now": "Usar horário atual",
    "timestamp.invalid": "Data ou timestamp inválido.",
    "timestamp.relative": "Relativo",

    "json.indentSize": "Tamanho da indentação",
    "json.format": "Formatar",
    "json.minify": "Minificar",
    "json.validJson": "JSON válido",
    "json.invalidJson": "JSON inválido",
    "json.placeholder": "{\n  \"cole\": \"seu JSON aqui\"\n}",

    "regex.pattern": "Padrão",
    "regex.flags": "Flags",
    "regex.testString": "Texto de teste",
    "regex.matches": "resultados",
    "regex.noMatches": "Nenhum resultado encontrado.",
    "regex.invalid": "Expressão regular inválida.",

    "diff.original": "Original",
    "diff.changed": "Alterado",
    "diff.noDiff": "Os dois textos são idênticos.",
    "diff.summary": "alterações",

    "markdown.editor": "Markdown",
    "markdown.preview": "Pré-visualização",
    "markdown.placeholder": "# Olá mundo\n\nEscreva um pouco de **Markdown** aqui.",

    "slugify.separator": "Separador",
    "slugify.lowercase": "Forçar minúsculas",
    "slugify.placeholder": "Meu Post Incrível do Blog!",

    "wordCounter.sentences": "Frases",
    "wordCounter.readingTime": "Tempo de leitura",
    "wordCounter.minutes": "min",
    "wordCounter.placeholder": "Comece a digitar ou cole seu texto...",
  },
};

export function useToolStrings(locale: Locale) {
  return (key: string) => toolStrings[locale][key] ?? key;
}
