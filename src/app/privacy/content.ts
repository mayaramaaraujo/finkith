import type { Locale } from "@/shared/lib/i18n/config";

export interface LegalSection {
  heading: string;
  paragraphs: string[];
}

export interface LegalPageContent {
  title: string;
  lastUpdated: string;
  intro: string;
  sections: LegalSection[];
}

const CONTACT_EMAIL = "mayaramaaraujo98@gmail.com";

export const privacyContent: Record<Locale, LegalPageContent> = {
  en: {
    title: "Privacy Policy",
    lastUpdated: "Last updated: August 6, 2026",
    intro:
      "Finkith (\"we\", \"us\", \"our\") is an app that helps groups of people — households, couples, roommates — track shared income and bills. This policy explains what personal data we collect, why, and the rights you have over it. It applies whether you're in the European Economic Area (protected by the GDPR), Brazil (protected by the LGPD), or elsewhere.",
    sections: [
      {
        heading: "1. What we collect",
        paragraphs: [
          "Account data: your email address, password (stored hashed, never in plain text), and display name.",
          "Financial data you enter: income entries, bill entries, categories, amounts, dates, and notes.",
          "Group data: group name, invite codes, and your membership/role (admin or member) within each group.",
          "Preferences: your language and currency settings.",
          "Push notification data: your browser's push subscription endpoint, only if you turn notifications on.",
          "We never collect your bank credentials or card numbers, and we don't connect to your bank — Finkith only stores the numbers you type in yourself.",
        ],
      },
      {
        heading: "2. Why we use it",
        paragraphs: [
          "To provide the service you signed up for — creating your account, saving your entries, and keeping your groups in sync.",
          "To send account-related emails, such as confirming your email address or resetting your password.",
          "To send push notifications about bills that are due soon or overdue, only if you've granted notification permission — you can revoke this anytime in your browser or in Settings.",
          "To keep the service secure and prevent abuse.",
        ],
      },
      {
        heading: "3. Who we share it with",
        paragraphs: [
          "We use a small number of infrastructure providers to run Finkith: Supabase (database hosting and authentication) and Resend (transactional email delivery). If you enable push notifications, delivery also passes through your browser's own push service (for example Google, Mozilla, or Apple).",
          "We do not sell your data, and we do not share it with advertisers.",
        ],
      },
      {
        heading: "4. Where your data lives",
        paragraphs: [
          "Your data is processed and stored by the infrastructure providers listed above, which may be located outside your country, including outside the EEA or Brazil. Where that happens, we rely on the safeguards those providers offer for international transfers.",
        ],
      },
      {
        heading: "5. How long we keep it",
        paragraphs: [
          "We keep your data for as long as your account exists. You can delete your account at any time from Settings — this permanently removes your profile, takes you out of any groups you belong to, and deletes the entries you own. Deletion is immediate and can't be undone.",
        ],
      },
      {
        heading: "6. Your rights",
        paragraphs: [
          "Under the GDPR and the LGPD, you have the right to access the personal data we hold about you, correct inaccurate data, request deletion, receive a copy of your data, and object to or restrict certain processing. You can also withdraw consent (for example, for push notifications) at any time.",
          `To exercise any of these rights, delete your account directly in Settings, or contact us at ${CONTACT_EMAIL}. If you're in the EEA, you may also lodge a complaint with your local data protection authority; if you're in Brazil, you may contact the ANPD.`,
        ],
      },
      {
        heading: "7. Data shared within your group",
        paragraphs: [
          "Finkith is built around shared groups. If you join a group, other members of that group can see the income and bill entries logged in it, including entries you add. Choose who you invite carefully.",
        ],
      },
      {
        heading: "8. Children",
        paragraphs: [
          "Finkith isn't directed at children, and we don't knowingly collect data from anyone under 16 (in the EEA) or 13 (in Brazil and other regions with a lower threshold).",
        ],
      },
      {
        heading: "9. Cookies",
        paragraphs: [
          "We only use strictly necessary cookies: one to remember your language preference, and the authentication cookies Supabase uses to keep you signed in. We don't currently use advertising or analytics cookies.",
        ],
      },
      {
        heading: "10. Changes to this policy",
        paragraphs: [
          "We may update this policy as the service evolves. We'll update the date at the top of this page, and we'll let you know in-app if a change is material.",
        ],
      },
      {
        heading: "11. Contact",
        paragraphs: [`Questions or requests about your data: ${CONTACT_EMAIL}`],
      },
    ],
  },
  "pt-BR": {
    title: "Política de Privacidade",
    lastUpdated: "Última atualização: 6 de agosto de 2026",
    intro:
      'O Finkith ("nós", "nosso") é um app que ajuda grupos de pessoas — famílias, casais, colegas de casa — a acompanhar renda e contas compartilhadas. Esta política explica quais dados pessoais coletamos, por quê, e quais direitos você tem sobre eles. Ela se aplica tanto para quem está no Espaço Econômico Europeu (protegido pelo GDPR) quanto no Brasil (protegido pela LGPD), ou em qualquer outro lugar.',
    sections: [
      {
        heading: "1. O que coletamos",
        paragraphs: [
          "Dados da conta: seu e-mail, senha (armazenada de forma criptografada, nunca em texto puro) e nome de exibição.",
          "Dados financeiros que você registra: entradas de renda, contas, categorias, valores, datas e notas.",
          "Dados do grupo: nome do grupo, códigos de convite, e sua função (admin ou membro) em cada grupo.",
          "Preferências: seu idioma e moeda escolhidos.",
          "Dados de notificação push: o endpoint de inscrição push do seu navegador, apenas se você ativar as notificações.",
          "Nunca coletamos dados bancários ou de cartão, e não nos conectamos ao seu banco — o Finkith só armazena os números que você mesmo digita.",
        ],
      },
      {
        heading: "2. Por que usamos esses dados",
        paragraphs: [
          "Para fornecer o serviço que você contratou — criar sua conta, salvar seus registros e manter seus grupos sincronizados.",
          "Para enviar e-mails relacionados à conta, como confirmação de e-mail ou redefinição de senha.",
          "Para enviar notificações push sobre contas que estão prestes a vencer ou atrasadas, somente se você tiver concedido permissão — você pode revogar isso a qualquer momento no navegador ou em Ajustes.",
          "Para manter o serviço seguro e prevenir abusos.",
        ],
      },
      {
        heading: "3. Com quem compartilhamos",
        paragraphs: [
          "Usamos um pequeno número de fornecedores de infraestrutura para operar o Finkith: Supabase (hospedagem de banco de dados e autenticação) e Resend (envio de e-mails transacionais). Se você ativar notificações push, o envio também passa pelo serviço de push do seu próprio navegador (por exemplo, Google, Mozilla ou Apple).",
          "Não vendemos seus dados, nem os compartilhamos com anunciantes.",
        ],
      },
      {
        heading: "4. Onde seus dados ficam armazenados",
        paragraphs: [
          "Seus dados são processados e armazenados pelos fornecedores de infraestrutura listados acima, que podem estar localizados fora do seu país, inclusive fora do Brasil ou do Espaço Econômico Europeu. Quando isso acontece, contamos com as salvaguardas que esses fornecedores oferecem para transferências internacionais.",
        ],
      },
      {
        heading: "5. Por quanto tempo mantemos seus dados",
        paragraphs: [
          "Mantemos seus dados enquanto sua conta existir. Você pode excluir sua conta a qualquer momento em Ajustes — isso remove permanentemente seu perfil, te tira de todos os grupos dos quais participa, e apaga os registros que você criou. A exclusão é imediata e não pode ser desfeita.",
        ],
      },
      {
        heading: "6. Seus direitos",
        paragraphs: [
          "De acordo com o GDPR e a LGPD, você tem o direito de acessar os dados pessoais que temos sobre você, corrigir dados incorretos, solicitar exclusão, receber uma cópia dos seus dados, e se opor ou restringir certos tratamentos. Você também pode revogar o consentimento (por exemplo, para notificações push) a qualquer momento.",
          `Para exercer qualquer um desses direitos, exclua sua conta diretamente em Ajustes, ou entre em contato conosco em ${CONTACT_EMAIL}. Se você estiver no Espaço Econômico Europeu, também pode registrar uma reclamação junto à sua autoridade local de proteção de dados; no Brasil, pode contatar a ANPD.`,
        ],
      },
      {
        heading: "7. Dados compartilhados dentro do seu grupo",
        paragraphs: [
          "O Finkith é construído em torno de grupos compartilhados. Se você entra em um grupo, os outros membros desse grupo podem ver as rendas e contas registradas nele, incluindo as que você adicionar. Escolha com cuidado quem você convida.",
        ],
      },
      {
        heading: "8. Crianças",
        paragraphs: [
          "O Finkith não é direcionado a crianças, e não coletamos intencionalmente dados de pessoas com menos de 16 anos (no Espaço Econômico Europeu) ou 13 anos (no Brasil e em outras regiões com limite menor).",
        ],
      },
      {
        heading: "9. Cookies",
        paragraphs: [
          "Usamos apenas cookies estritamente necessários: um para lembrar sua preferência de idioma, e os cookies de autenticação que o Supabase usa para manter você conectado. Atualmente não usamos cookies de publicidade ou análise.",
        ],
      },
      {
        heading: "10. Alterações nesta política",
        paragraphs: [
          "Podemos atualizar esta política conforme o serviço evolui. Atualizaremos a data no topo desta página, e avisaremos no app caso a mudança seja significativa.",
        ],
      },
      {
        heading: "11. Contato",
        paragraphs: [`Dúvidas ou solicitações sobre seus dados: ${CONTACT_EMAIL}`],
      },
    ],
  },
  "es-ES": {
    title: "Política de Privacidad",
    lastUpdated: "Última actualización: 6 de agosto de 2026",
    intro:
      'Finkith ("nosotros", "nuestro") es una app que ayuda a grupos de personas — familias, parejas, compañeros de piso — a llevar el control de ingresos y facturas compartidos. Esta política explica qué datos personales recogemos, por qué, y qué derechos tienes sobre ellos. Se aplica tanto si estás en el Espacio Económico Europeo (protegido por el RGPD) como en Brasil (protegido por la LGPD) o en cualquier otro lugar.',
    sections: [
      {
        heading: "1. Qué recogemos",
        paragraphs: [
          "Datos de la cuenta: tu dirección de correo electrónico, contraseña (almacenada cifrada, nunca en texto plano) y nombre visible.",
          "Datos financieros que introduces: registros de ingresos, facturas, categorías, importes, fechas y notas.",
          "Datos del grupo: nombre del grupo, códigos de invitación y tu pertenencia/rol (administrador o miembro) en cada grupo.",
          "Preferencias: tus ajustes de idioma y moneda.",
          "Datos de notificaciones push: el endpoint de suscripción push de tu navegador, solo si activas las notificaciones.",
          "Nunca recogemos tus credenciales bancarias ni números de tarjeta, y no nos conectamos a tu banco — Finkith solo guarda las cifras que tú mismo introduces.",
        ],
      },
      {
        heading: "2. Por qué los usamos",
        paragraphs: [
          "Para prestar el servicio para el que te has registrado: crear tu cuenta, guardar tus registros y mantener tus grupos sincronizados.",
          "Para enviar correos relacionados con la cuenta, como la confirmación de tu dirección de correo o el restablecimiento de tu contraseña.",
          "Para enviar notificaciones push sobre facturas que vencen pronto o están vencidas, solo si has concedido permiso de notificaciones — puedes revocarlo en cualquier momento en tu navegador o en Ajustes.",
          "Para mantener el servicio seguro y prevenir abusos.",
        ],
      },
      {
        heading: "3. Con quién los compartimos",
        paragraphs: [
          "Usamos un número reducido de proveedores de infraestructura para hacer funcionar Finkith: Supabase (alojamiento de base de datos y autenticación) y Resend (envío de correo transaccional). Si activas las notificaciones push, el envío pasa también por el servicio de push de tu propio navegador (por ejemplo, Google, Mozilla o Apple).",
          "No vendemos tus datos ni los compartimos con anunciantes.",
        ],
      },
      {
        heading: "4. Dónde se alojan tus datos",
        paragraphs: [
          "Tus datos son tratados y almacenados por los proveedores de infraestructura indicados arriba, que pueden estar ubicados fuera de tu país, incluso fuera del EEE o de Brasil. Cuando eso ocurre, nos apoyamos en las garantías que esos proveedores ofrecen para las transferencias internacionales.",
        ],
      },
      {
        heading: "5. Cuánto tiempo los conservamos",
        paragraphs: [
          "Conservamos tus datos mientras exista tu cuenta. Puedes eliminar tu cuenta en cualquier momento desde Ajustes — esto borra permanentemente tu perfil, te saca de todos los grupos a los que perteneces y elimina los registros de los que eres propietario. La eliminación es inmediata y no se puede deshacer.",
        ],
      },
      {
        heading: "6. Tus derechos",
        paragraphs: [
          "Conforme al RGPD y a la LGPD, tienes derecho a acceder a los datos personales que tenemos sobre ti, rectificar datos inexactos, solicitar su supresión, recibir una copia de tus datos y oponerte o limitar determinados tratamientos. También puedes retirar tu consentimiento (por ejemplo, para las notificaciones push) en cualquier momento.",
          `Para ejercer cualquiera de estos derechos, elimina tu cuenta directamente en Ajustes o escríbenos a ${CONTACT_EMAIL}. Si estás en el EEE, también puedes presentar una reclamación ante tu autoridad de protección de datos (en España, la AEPD); si estás en Brasil, puedes contactar con la ANPD.`,
        ],
      },
      {
        heading: "7. Datos compartidos dentro de tu grupo",
        paragraphs: [
          "Finkith está construido en torno a grupos compartidos. Si te unes a un grupo, los demás miembros pueden ver los ingresos y las facturas registrados en él, incluidos los que añadas tú. Elige con cuidado a quién invitas.",
        ],
      },
      {
        heading: "8. Menores",
        paragraphs: [
          "Finkith no está dirigido a menores y no recogemos conscientemente datos de personas menores de 16 años (en el EEE) o de 13 años (en Brasil y otras regiones con un límite inferior).",
        ],
      },
      {
        heading: "9. Cookies",
        paragraphs: [
          "Solo usamos cookies estrictamente necesarias: una para recordar tu preferencia de idioma y las cookies de autenticación que Supabase utiliza para mantener tu sesión iniciada. Actualmente no usamos cookies publicitarias ni analíticas.",
        ],
      },
      {
        heading: "10. Cambios en esta política",
        paragraphs: [
          "Podemos actualizar esta política a medida que el servicio evolucione. Actualizaremos la fecha en la parte superior de esta página y te avisaremos dentro de la app si el cambio es sustancial.",
        ],
      },
      {
        heading: "11. Contacto",
        paragraphs: [`Dudas o solicitudes sobre tus datos: ${CONTACT_EMAIL}`],
      },
    ],
  },
};
