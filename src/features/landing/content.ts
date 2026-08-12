import type { Locale } from "@/shared/lib/i18n/config";

export interface LandingItem {
  title: string;
  description: string;
}

export interface LandingFaq {
  question: string;
  answer: string;
}

/**
 * The audience and feature cards each pair copy with an icon. Keying both by id
 * — instead of matching two arrays by position — is what stops a locale that
 * gains or loses an entry from silently shifting every icon along by one.
 */
export const AUDIENCE_IDS = ["couples", "flatmates", "families"] as const;
export type AudienceId = (typeof AUDIENCE_IDS)[number];

export const FEATURE_IDS = [
  "incomeByPerson",
  "bills",
  "projectedBalance",
  "reminders",
  "categories",
  "history",
  "language",
  "install",
  "privacy",
] as const;
export type FeatureId = (typeof FEATURE_IDS)[number];

export interface LandingContent {
  /** SEO — the `<title>` and `<meta name="description">` for `/`. */
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  /** Alt text for the generated Open Graph image. */
  ogImageAlt: string;

  nav: {
    features: string;
    howItWorks: string;
    faq: string;
    signIn: string;
    getStarted: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    titleAccent: string;
    subtitle: string;
    primaryCta: string;
    secondaryCta: string;
    reassurance: string[];
    /** Labels and figures for the mocked-up dashboard beside the headline. */
    preview: {
      groupName: string;
      month: string;
      members: { name: string; income: number }[];
      bills: { name: string; amount: number; paid: boolean }[];
      paidLabel: string;
      pendingLabel: string;
    };
  };
  audience: {
    title: string;
    subtitle: string;
    items: Record<AudienceId, LandingItem>;
  };
  howItWorks: {
    title: string;
    subtitle: string;
    steps: LandingItem[];
  };
  features: {
    title: string;
    subtitle: string;
    items: Record<FeatureId, LandingItem>;
  };
  faq: {
    title: string;
    subtitle: string;
    items: LandingFaq[];
  };
  finalCta: {
    title: string;
    subtitle: string;
    cta: string;
    secondary: string;
  };
  footer: {
    tagline: string;
    productHeading: string;
    legalHeading: string;
    languageHeading: string;
    rights: string;
  };
}

export const landingContent: Record<Locale, LandingContent> = {
  en: {
    metaTitle: "Finkith — Shared Income & Bill Tracker for Couples and Roommates",
    metaDescription:
      "Finkith is a free shared budget app for couples, families and flatmates. Track everyone's income, keep shared bills in one place, get due-date reminders, and always know what's left this month.",
    keywords: [
      "shared budget app",
      "bill tracker for couples",
      "roommate expense tracker",
      "household budget app",
      "split bills app",
      "shared expenses tracker",
      "income and bills tracker",
      "family finance app",
    ],
    ogImageAlt: "Finkith — track shared income and bills in one picture, every month",

    nav: {
      features: "Features",
      howItWorks: "How it works",
      faq: "FAQ",
      signIn: "Sign in",
      getStarted: "Get started free",
    },
    hero: {
      eyebrow: "Shared money, without the spreadsheet",
      title: "Everything that comes in. Everything that's owed.",
      titleAccent: "One shared picture.",
      subtitle:
        "Finkith is the money tracker for people who share bills — couples, families, flatmates. Log what each person brings in, keep every shared bill in one place, and see exactly what's left before the month runs out.",
      primaryCta: "Create your group — free",
      secondaryCta: "See how it works",
      reassurance: ["No bank connection", "No card required", "Works on any phone"],
      preview: {
        groupName: "Casa Ferrari",
        month: "This month",
        members: [
          { name: "Ana", income: 2100 },
          { name: "Marco", income: 1750 },
          { name: "Júlia", income: 900 },
        ],
        bills: [
          { name: "Rent", amount: 1200, paid: true },
          { name: "Electricity", amount: 84.5, paid: true },
          { name: "Internet", amount: 39.9, paid: false },
        ],
        paidLabel: "Paid",
        pendingLabel: "Pending",
      },
    },
    audience: {
      title: "Built for money that isn't only yours",
      subtitle:
        "Anyone splitting a roof, a fridge or a phone plan ends up doing the same maths in their head. Finkith does it in the open, for everyone at once.",
      items: {
        couples: {
          title: "Couples",
          description:
            "Two salaries, one set of bills. See what each of you brought in this month and what's still pending, without one person quietly holding the whole budget in their head.",
        },
        flatmates: {
          title: "Flatmates",
          description:
            "Rent, electricity, internet, cleaning. Everyone sees the same list, who's paid and what's overdue — so nobody has to be the one chasing.",
        },
        families: {
          title: "Families",
          description:
            "Irregular income, fixed bills, and a month that has to balance. Track salaries, freelance work and side income side by side against everything the house owes.",
        },
      },
    },
    howItWorks: {
      title: "Three steps to a month that adds up",
      subtitle: "Set-up takes about two minutes, and there's nothing to connect or configure.",
      steps: [
        {
          title: "Create your group",
          description:
            "Name it, pick your currency, and share the invite link. Whoever joins can start logging income and bills straight away.",
        },
        {
          title: "Add income and bills",
          description:
            "Log what each person earns and every shared bill — fixed or variable, with a due day and a category. Recurring bills roll over on their own each month.",
        },
        {
          title: "Watch what's left",
          description:
            "Your home screen keeps combined income, total bills and the projected balance up to date, and reminds you before a bill goes overdue.",
        },
      ],
    },
    features: {
      title: "Everything a shared month needs",
      subtitle:
        "No categories to invent, no formulas to maintain, no shared spreadsheet that only one person understands.",
      items: {
        incomeByPerson: {
          title: "Income by person",
          description:
            "Every entry is tied to whoever earned it, so the combined total always breaks down into who contributed what this month.",
        },
        bills: {
          title: "Bills that behave like bills",
          description:
            "Fixed or variable, with a due day, a paid/pending state and an optional monthly repeat — so next month starts already filled in.",
        },
        projectedBalance: {
          title: "Projected balance",
          description:
            "Income minus everything owed, updated the moment anything changes, plus what's actually available today once the paid bills are out.",
        },
        reminders: {
          title: "Due-date reminders",
          description:
            "Push notifications and emails when a shared bill is due soon or overdue — sent to each person in their own language.",
        },
        categories: {
          title: "Categories and breakdowns",
          description:
            "Housing, utilities, groceries, subscriptions — or your own. See where the money went with a per-category breakdown for income and spending.",
        },
        history: {
          title: "Six months of history",
          description:
            "A trend chart of everything that came in and went out, so you can tell a strange month from a real pattern.",
        },
        language: {
          title: "Your language, your currency",
          description:
            "English, Portuguese and Spanish, with euro or Brazilian real formatted the way you'd write it by hand. Each person can pick their own language.",
        },
        install: {
          title: "Installs like an app",
          description:
            "Add Finkith to your home screen on iPhone or Android straight from the browser. No app store, no download, no update to chase.",
        },
        privacy: {
          title: "Private by default",
          description:
            "No bank connection and no card. Your group's data is only readable by its members, and you can delete your account and everything in it at any time.",
        },
      },
    },
    faq: {
      title: "Questions people ask first",
      subtitle: "Anything else, write to us — a real person reads it.",
      items: [
        {
          question: "Is Finkith free?",
          answer:
            "Yes. Creating a group, inviting the people you share money with, and tracking income and bills are all free, with no card required and no trial to expire.",
        },
        {
          question: "Do I have to connect my bank account?",
          answer:
            "No — and you can't, by design. Finkith never touches your bank. You decide what to enter, which means the only financial data it holds is what you typed in yourself.",
        },
        {
          question: "How many people can share a group?",
          answer:
            "As many as you need. Share the invite link and anyone who opens it can join, log their income and add shared bills. It works the same for two people or five.",
        },
        {
          question: "Which currencies and languages are supported?",
          answer:
            "Euro and Brazilian real, chosen once per group. The interface is available in English, Portuguese (Brazil) and Spanish (Spain), and each member can read it in their own language.",
        },
        {
          question: "Will it remind me before a bill is due?",
          answer:
            "Yes. Turn on notifications and Finkith sends a push message and an email when a shared bill is due soon or already overdue, so nothing slips past payday.",
        },
        {
          question: "Is there an iPhone or Android app?",
          answer:
            "Finkith installs straight from your browser to your home screen and then behaves like any other app, full-screen and offline-tolerant — without going through an app store.",
        },
        {
          question: "Who can see what I add?",
          answer:
            "Only the members of your group. Every record is locked to group membership at the database level, and deleting your account removes you and your data from the groups you belong to.",
        },
      ],
    },
    finalCta: {
      title: "Stop guessing what's left this month",
      subtitle:
        "Create a group, send one link, and everyone you share money with is looking at the same picture in under two minutes.",
      cta: "Get started free",
      secondary: "I already have an account",
    },
    footer: {
      tagline: "Track what everyone brings in and what's owed. One shared picture, every month.",
      productHeading: "Product",
      legalHeading: "Legal",
      languageHeading: "Language",
      rights: "All rights reserved.",
    },
  },

  "pt-BR": {
    metaTitle: "Finkith — Controle de Renda e Contas Compartilhadas para Casais e Colegas de Casa",
    metaDescription:
      "O Finkith é um app gratuito de orçamento compartilhado para casais, famílias e colegas de casa. Acompanhe a renda de cada um, reúna todas as contas da casa, receba lembretes de vencimento e saiba quanto sobra no mês.",
    keywords: [
      "app de orçamento compartilhado",
      "controle de contas para casais",
      "dividir contas da casa",
      "app de finanças da família",
      "controle de despesas compartilhadas",
      "planilha de gastos do casal",
      "app de contas a pagar",
      "organizar finanças em casa",
    ],
    ogImageAlt: "Finkith — renda e contas compartilhadas em uma única visão, todo mês",

    nav: {
      features: "Recursos",
      howItWorks: "Como funciona",
      faq: "Dúvidas",
      signIn: "Entrar",
      getStarted: "Começar grátis",
    },
    hero: {
      eyebrow: "Dinheiro compartilhado, sem planilha",
      title: "Tudo que entra. Tudo que se deve.",
      titleAccent: "Uma visão só, para todo mundo.",
      subtitle:
        "O Finkith é o controle financeiro de quem divide contas — casais, famílias, colegas de casa. Registre o que cada pessoa recebe, reúna todas as contas em um lugar e veja exatamente quanto sobra antes que o mês acabe.",
      primaryCta: "Criar meu grupo — grátis",
      secondaryCta: "Ver como funciona",
      reassurance: ["Sem conectar o banco", "Sem cartão de crédito", "Funciona em qualquer celular"],
      preview: {
        groupName: "Casa Ferrari",
        month: "Este mês",
        members: [
          { name: "Ana", income: 2100 },
          { name: "Marco", income: 1750 },
          { name: "Júlia", income: 900 },
        ],
        bills: [
          { name: "Aluguel", amount: 1200, paid: true },
          { name: "Luz", amount: 84.5, paid: true },
          { name: "Internet", amount: 39.9, paid: false },
        ],
        paidLabel: "Pago",
        pendingLabel: "Pendente",
      },
    },
    audience: {
      title: "Feito para o dinheiro que não é só seu",
      subtitle:
        "Quem divide teto, geladeira ou plano de celular acaba fazendo a mesma conta de cabeça. O Finkith faz essa conta à vista de todos, de uma vez.",
      items: {
        couples: {
          title: "Casais",
          description:
            "Dois salários, um conjunto de contas. Vejam quanto cada um trouxe no mês e o que ainda está pendente, sem que uma pessoa carregue o orçamento inteiro na cabeça.",
        },
        flatmates: {
          title: "Colegas de casa",
          description:
            "Aluguel, luz, internet, faxina. Todo mundo enxerga a mesma lista, quem já pagou e o que está atrasado — sem ninguém precisar ficar cobrando.",
        },
        families: {
          title: "Famílias",
          description:
            "Renda que varia, contas que não variam, e um mês que precisa fechar. Acompanhe salário, freelas e renda extra lado a lado com tudo que a casa deve.",
        },
      },
    },
    howItWorks: {
      title: "Três passos para o mês fechar",
      subtitle: "A configuração leva uns dois minutos, e não há nada para conectar ou ajustar.",
      steps: [
        {
          title: "Crie seu grupo",
          description:
            "Dê um nome, escolha a moeda e compartilhe o link de convite. Quem entrar já pode registrar renda e contas na hora.",
        },
        {
          title: "Adicione renda e contas",
          description:
            "Registre o que cada pessoa recebe e cada conta da casa — fixa ou variável, com dia de vencimento e categoria. As contas recorrentes se repetem sozinhas todo mês.",
        },
        {
          title: "Acompanhe o que sobra",
          description:
            "A tela inicial mantém renda somada, total de contas e saldo previsto sempre atualizados, e avisa antes de uma conta vencer.",
        },
      ],
    },
    features: {
      title: "Tudo que um mês compartilhado precisa",
      subtitle:
        "Sem inventar categorias, sem manter fórmulas, sem planilha compartilhada que só uma pessoa entende.",
      items: {
        incomeByPerson: {
          title: "Renda por pessoa",
          description:
            "Cada lançamento fica ligado a quem recebeu, então o total somado sempre se abre em quem contribuiu com o quê neste mês.",
        },
        bills: {
          title: "Contas que se comportam como contas",
          description:
            "Fixas ou variáveis, com dia de vencimento, estado pago/pendente e repetição mensal opcional — o mês seguinte já começa preenchido.",
        },
        projectedBalance: {
          title: "Saldo previsto",
          description:
            "Renda menos tudo que se deve, atualizado no instante em que algo muda, mais o que realmente está disponível hoje descontadas as contas já pagas.",
        },
        reminders: {
          title: "Lembretes de vencimento",
          description:
            "Notificações e e-mails quando uma conta compartilhada está perto de vencer ou já venceu — enviados para cada pessoa no idioma dela.",
        },
        categories: {
          title: "Categorias e detalhamento",
          description:
            "Moradia, contas de casa, mercado, assinaturas — ou as suas. Veja para onde o dinheiro foi com um detalhamento por categoria, na renda e nos gastos.",
        },
        history: {
          title: "Seis meses de histórico",
          description:
            "Um gráfico de tudo que entrou e saiu, para distinguir um mês estranho de um padrão de verdade.",
        },
        language: {
          title: "Seu idioma, sua moeda",
          description:
            "Português, inglês e espanhol, com real ou euro formatados do jeito que você escreveria à mão. Cada pessoa escolhe o próprio idioma.",
        },
        install: {
          title: "Instala como aplicativo",
          description:
            "Adicione o Finkith à tela de início do iPhone ou do Android direto pelo navegador. Sem loja de apps, sem download, sem atualização para correr atrás.",
        },
        privacy: {
          title: "Privado por padrão",
          description:
            "Sem conectar banco e sem cartão. Os dados do grupo só podem ser lidos por quem é do grupo, e você pode apagar sua conta e tudo que há nela quando quiser.",
        },
      },
    },
    faq: {
      title: "As dúvidas que aparecem primeiro",
      subtitle: "Qualquer outra coisa, escreva para a gente — uma pessoa de verdade lê.",
      items: [
        {
          question: "O Finkith é gratuito?",
          answer:
            "Sim. Criar um grupo, convidar quem divide dinheiro com você e acompanhar renda e contas é tudo gratuito, sem cartão e sem período de teste para expirar.",
        },
        {
          question: "Preciso conectar minha conta bancária?",
          answer:
            "Não — e nem é possível, de propósito. O Finkith nunca toca no seu banco. Você decide o que registrar, ou seja, o único dado financeiro guardado é o que você mesmo digitou.",
        },
        {
          question: "Quantas pessoas cabem em um grupo?",
          answer:
            "Quantas você precisar. Compartilhe o link de convite e quem abrir pode entrar, registrar a própria renda e adicionar contas. Funciona igual para duas ou para cinco pessoas.",
        },
        {
          question: "Quais moedas e idiomas são aceitos?",
          answer:
            "Real e euro, escolhidos uma vez por grupo. A interface está em português (Brasil), inglês e espanhol (Espanha), e cada pessoa lê no próprio idioma.",
        },
        {
          question: "Ele me lembra antes do vencimento?",
          answer:
            "Sim. Com as notificações ativadas, o Finkith envia um aviso e um e-mail quando uma conta compartilhada está perto de vencer ou já venceu, para nada passar batido.",
        },
        {
          question: "Existe app para iPhone ou Android?",
          answer:
            "O Finkith se instala direto do navegador na tela de início e depois se comporta como qualquer outro app, em tela cheia — sem passar por loja de aplicativos.",
        },
        {
          question: "Quem consegue ver o que eu registro?",
          answer:
            "Só os membros do seu grupo. Cada registro é restrito à participação no grupo no nível do banco de dados, e apagar sua conta remove você e seus dados dos grupos de que participa.",
        },
      ],
    },
    finalCta: {
      title: "Pare de adivinhar quanto sobra no mês",
      subtitle:
        "Crie um grupo, mande um link, e todo mundo que divide dinheiro com você está olhando para a mesma tela em menos de dois minutos.",
      cta: "Começar grátis",
      secondary: "Já tenho uma conta",
    },
    footer: {
      tagline: "Acompanhe o que cada um traz e o que se deve. Uma visão compartilhada, todo mês.",
      productHeading: "Produto",
      legalHeading: "Legal",
      languageHeading: "Idioma",
      rights: "Todos os direitos reservados.",
    },
  },

  "es-ES": {
    metaTitle: "Finkith — Control de Ingresos y Gastos Compartidos para Parejas y Compañeros de Piso",
    metaDescription:
      "Finkith es una app gratuita de presupuesto compartido para parejas, familias y compañeros de piso. Registra los ingresos de cada uno, reúne todos los gastos de casa, recibe avisos de vencimiento y mira cuánto queda cada mes.",
    keywords: [
      "app de presupuesto compartido",
      "controlar gastos en pareja",
      "dividir gastos del piso",
      "app de finanzas familiares",
      "control de gastos compartidos",
      "gestor de recibos del hogar",
      "app para compañeros de piso",
      "organizar las cuentas de casa",
    ],
    ogImageAlt: "Finkith — ingresos y gastos compartidos en una sola vista, cada mes",

    nav: {
      features: "Funciones",
      howItWorks: "Cómo funciona",
      faq: "Preguntas",
      signIn: "Iniciar sesión",
      getStarted: "Empezar gratis",
    },
    hero: {
      eyebrow: "Dinero compartido, sin hojas de cálculo",
      title: "Todo lo que entra. Todo lo que se debe.",
      titleAccent: "Una sola vista, para todos.",
      subtitle:
        "Finkith es el control de dinero para quien comparte gastos — parejas, familias, compañeros de piso. Registra lo que aporta cada persona, reúne todos los recibos en un sitio y mira exactamente cuánto queda antes de que acabe el mes.",
      primaryCta: "Crear mi grupo — gratis",
      secondaryCta: "Ver cómo funciona",
      reassurance: ["Sin conectar el banco", "Sin tarjeta", "Funciona en cualquier móvil"],
      preview: {
        groupName: "Casa Ferrari",
        month: "Este mes",
        members: [
          { name: "Ana", income: 2100 },
          { name: "Marco", income: 1750 },
          { name: "Júlia", income: 900 },
        ],
        bills: [
          { name: "Alquiler", amount: 1200, paid: true },
          { name: "Luz", amount: 84.5, paid: true },
          { name: "Internet", amount: 39.9, paid: false },
        ],
        paidLabel: "Pagado",
        pendingLabel: "Pendiente",
      },
    },
    audience: {
      title: "Pensado para el dinero que no es solo tuyo",
      subtitle:
        "Quien comparte techo, nevera o tarifa de móvil acaba haciendo la misma cuenta mentalmente. Finkith la hace a la vista de todos y de una vez.",
      items: {
        couples: {
          title: "Parejas",
          description:
            "Dos sueldos, un mismo conjunto de recibos. Ved cuánto ha aportado cada uno este mes y qué queda pendiente, sin que una persona lleve todo el presupuesto en la cabeza.",
        },
        flatmates: {
          title: "Compañeros de piso",
          description:
            "Alquiler, luz, internet, limpieza. Todos ven la misma lista, quién ha pagado y qué está vencido — sin que nadie tenga que ir reclamando.",
        },
        families: {
          title: "Familias",
          description:
            "Ingresos que varían, recibos que no, y un mes que tiene que cuadrar. Sigue nóminas, trabajos por cuenta propia e ingresos extra junto a todo lo que debe la casa.",
        },
      },
    },
    howItWorks: {
      title: "Tres pasos para que el mes cuadre",
      subtitle: "Configurarlo lleva unos dos minutos y no hay nada que conectar ni que ajustar.",
      steps: [
        {
          title: "Crea tu grupo",
          description:
            "Ponle nombre, elige la moneda y comparte el enlace de invitación. Quien entre puede registrar ingresos y gastos desde el primer momento.",
        },
        {
          title: "Añade ingresos y gastos",
          description:
            "Registra lo que gana cada persona y cada recibo compartido — fijo o variable, con día de vencimiento y categoría. Los recurrentes se repiten solos cada mes.",
        },
        {
          title: "Mira cuánto queda",
          description:
            "La pantalla de inicio mantiene al día los ingresos sumados, el total de gastos y el saldo previsto, y avisa antes de que un recibo se pase de fecha.",
        },
      ],
    },
    features: {
      title: "Todo lo que necesita un mes compartido",
      subtitle:
        "Sin inventar categorías, sin mantener fórmulas, sin una hoja de cálculo que solo entiende una persona.",
      items: {
        incomeByPerson: {
          title: "Ingresos por persona",
          description:
            "Cada apunte queda ligado a quien lo ha ingresado, así que el total siempre se desglosa en quién ha aportado qué este mes.",
        },
        bills: {
          title: "Recibos que se comportan como recibos",
          description:
            "Fijos o variables, con día de vencimiento, estado pagado/pendiente y repetición mensual opcional — el mes siguiente empieza ya relleno.",
        },
        projectedBalance: {
          title: "Saldo previsto",
          description:
            "Ingresos menos todo lo que se debe, actualizado en cuanto algo cambia, además de lo que está realmente disponible hoy descontando lo ya pagado.",
        },
        reminders: {
          title: "Avisos de vencimiento",
          description:
            "Notificaciones y correos cuando un recibo compartido está a punto de vencer o ya ha vencido — enviados a cada persona en su idioma.",
        },
        categories: {
          title: "Categorías y desglose",
          description:
            "Vivienda, suministros, compra, suscripciones — o las tuyas. Mira a dónde ha ido el dinero con un desglose por categoría, en ingresos y en gastos.",
        },
        history: {
          title: "Seis meses de histórico",
          description:
            "Un gráfico de todo lo que ha entrado y salido, para distinguir un mes raro de un patrón real.",
        },
        language: {
          title: "Tu idioma, tu moneda",
          description:
            "Español, inglés y portugués, con euro o real brasileño con el formato en que lo escribirías a mano. Cada persona elige su propio idioma.",
        },
        install: {
          title: "Se instala como una app",
          description:
            "Añade Finkith a la pantalla de inicio del iPhone o del Android desde el propio navegador. Sin tienda de apps, sin descargas, sin actualizaciones que perseguir.",
        },
        privacy: {
          title: "Privado por defecto",
          description:
            "Sin conectar el banco y sin tarjeta. Los datos del grupo solo los pueden leer sus miembros, y puedes borrar tu cuenta y todo lo que contiene cuando quieras.",
        },
      },
    },
    faq: {
      title: "Las preguntas que surgen primero",
      subtitle: "Para cualquier otra cosa, escríbenos — la lee una persona de verdad.",
      items: [
        {
          question: "¿Finkith es gratis?",
          answer:
            "Sí. Crear un grupo, invitar a quien comparte dinero contigo y llevar los ingresos y los gastos es gratis, sin tarjeta y sin una prueba que caduque.",
        },
        {
          question: "¿Tengo que conectar mi cuenta bancaria?",
          answer:
            "No — y no se puede, a propósito. Finkith nunca toca tu banco. Tú decides qué introducir, así que el único dato financiero que guarda es el que has escrito tú.",
        },
        {
          question: "¿Cuántas personas caben en un grupo?",
          answer:
            "Las que necesites. Comparte el enlace de invitación y quien lo abra puede unirse, registrar sus ingresos y añadir gastos. Funciona igual para dos personas que para cinco.",
        },
        {
          question: "¿Qué monedas e idiomas admite?",
          answer:
            "Euro y real brasileño, elegidos una vez por grupo. La interfaz está en español (España), inglés y portugués (Brasil), y cada miembro la lee en su idioma.",
        },
        {
          question: "¿Me avisará antes de un vencimiento?",
          answer:
            "Sí. Con las notificaciones activadas, Finkith manda un aviso y un correo cuando un recibo compartido está a punto de vencer o ya ha vencido, para que no se escape ninguno.",
        },
        {
          question: "¿Hay app para iPhone o Android?",
          answer:
            "Finkith se instala desde el navegador en la pantalla de inicio y luego se comporta como cualquier otra app, a pantalla completa — sin pasar por una tienda de aplicaciones.",
        },
        {
          question: "¿Quién puede ver lo que añado?",
          answer:
            "Solo los miembros de tu grupo. Cada registro queda restringido a la pertenencia al grupo a nivel de base de datos, y borrar tu cuenta te elimina a ti y a tus datos de los grupos a los que perteneces.",
        },
      ],
    },
    finalCta: {
      title: "Deja de adivinar cuánto queda este mes",
      subtitle:
        "Crea un grupo, manda un enlace, y todos los que comparten dinero contigo estarán mirando la misma vista en menos de dos minutos.",
      cta: "Empezar gratis",
      secondary: "Ya tengo cuenta",
    },
    footer: {
      tagline: "Controla lo que aporta cada uno y lo que se debe. Una vista compartida, cada mes.",
      productHeading: "Producto",
      legalHeading: "Legal",
      languageHeading: "Idioma",
      rights: "Todos los derechos reservados.",
    },
  },
};
