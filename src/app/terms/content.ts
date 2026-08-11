import type { Locale } from "@/shared/lib/i18n/config";
import type { LegalPageContent } from "@/app/privacy/content";

const CONTACT_EMAIL = "mayaramaaraujo98@gmail.com";

export const termsContent: Record<Locale, LegalPageContent> = {
  en: {
    title: "Terms of Service",
    lastUpdated: "Last updated: August 6, 2026",
    intro:
      "These Terms govern your use of Finkith. By creating an account or using the app, you agree to them. If you don't agree, please don't use the service.",
    sections: [
      {
        heading: "1. What Finkith is",
        paragraphs: [
          "Finkith is a tool for tracking shared income and bills within a household or group. It is not a bank, doesn't connect to your bank accounts, doesn't move or hold money, and isn't a regulated financial institution. Nothing in the app is financial, tax, or legal advice.",
        ],
      },
      {
        heading: "2. Accounts & groups",
        paragraphs: [
          "You need an account to use Finkith, and you're responsible for keeping your login credentials secure and for all activity under your account.",
          "Groups are shared spaces: when you create or join a group, other members can see the income and bill data logged in it. Group admins can manage members and remove people from the group.",
        ],
      },
      {
        heading: "3. Acceptable use",
        paragraphs: [
          "Don't use Finkith to store or share unlawful content, impersonate someone else, try to access other users' accounts or groups without authorization, or interfere with the normal operation of the service.",
        ],
      },
      {
        heading: "4. Pricing",
        paragraphs: [
          "Finkith is currently free to use. We may introduce paid plans or features in the future; if we do, we'll give existing users advance notice before any change that affects them.",
        ],
      },
      {
        heading: "5. Your data",
        paragraphs: [
          "You own the data you enter into Finkith. See our Privacy Policy for how we handle it. You can delete your data at any time from Settings.",
        ],
      },
      {
        heading: "6. Availability",
        paragraphs: [
          "Finkith is provided \"as is\" and \"as available.\" We don't guarantee the service will be uninterrupted or error-free, and we may modify or discontinue features.",
        ],
      },
      {
        heading: "7. Limitation of liability",
        paragraphs: [
          "To the maximum extent permitted by law, Finkith and its operator aren't liable for indirect, incidental, or consequential damages arising from your use of the service, including decisions made based on data entered by you or other group members. This doesn't limit any liability that can't be excluded under applicable EU or Brazilian (CDC) consumer-protection law.",
        ],
      },
      {
        heading: "8. Termination",
        paragraphs: [
          "You may stop using Finkith and delete your account at any time. We may suspend or terminate accounts that violate these Terms.",
        ],
      },
      {
        heading: "9. Governing law",
        paragraphs: [
          "These Terms are governed by the laws of Brazil, without prejudice to any mandatory consumer-protection rights you have under the laws of your country of residence if you're located in the EU/EEA.",
        ],
      },
      {
        heading: "10. Changes to these Terms",
        paragraphs: [
          "We may update these Terms as the service evolves. Continuing to use Finkith after a change means you accept the updated Terms.",
        ],
      },
      {
        heading: "11. Contact",
        paragraphs: [`Questions about these Terms: ${CONTACT_EMAIL}`],
      },
    ],
  },
  "pt-BR": {
    title: "Termos de Uso",
    lastUpdated: "Última atualização: 6 de agosto de 2026",
    intro:
      "Estes Termos regem o uso do Finkith. Ao criar uma conta ou usar o app, você concorda com eles. Se não concordar, por favor não use o serviço.",
    sections: [
      {
        heading: "1. O que é o Finkith",
        paragraphs: [
          "O Finkith é uma ferramenta para acompanhar renda e contas compartilhadas dentro de uma casa ou grupo. Não é um banco, não se conecta às suas contas bancárias, não movimenta nem guarda dinheiro, e não é uma instituição financeira regulada. Nada no app constitui aconselhamento financeiro, tributário ou jurídico.",
        ],
      },
      {
        heading: "2. Contas e grupos",
        paragraphs: [
          "Você precisa de uma conta para usar o Finkith, e é responsável por manter suas credenciais de login seguras e por toda atividade realizada na sua conta.",
          "Grupos são espaços compartilhados: ao criar ou entrar em um grupo, os outros membros podem ver os dados de renda e contas registrados nele. Administradores do grupo podem gerenciar membros e remover pessoas do grupo.",
        ],
      },
      {
        heading: "3. Uso aceitável",
        paragraphs: [
          "Não use o Finkith para armazenar ou compartilhar conteúdo ilegal, se passar por outra pessoa, tentar acessar contas ou grupos de outros usuários sem autorização, ou interferir no funcionamento normal do serviço.",
        ],
      },
      {
        heading: "4. Preços",
        paragraphs: [
          "O Finkith é gratuito no momento. Podemos introduzir planos ou recursos pagos no futuro; se isso acontecer, avisaremos os usuários existentes com antecedência sobre qualquer mudança que os afete.",
        ],
      },
      {
        heading: "5. Seus dados",
        paragraphs: [
          "Você é o proprietário dos dados que insere no Finkith. Veja nossa Política de Privacidade para saber como tratamos esses dados. Você pode excluir seus dados a qualquer momento em Ajustes.",
        ],
      },
      {
        heading: "6. Disponibilidade",
        paragraphs: [
          'O Finkith é fornecido "como está" e "conforme disponível". Não garantimos que o serviço será ininterrupto ou livre de erros, e podemos modificar ou descontinuar recursos.',
        ],
      },
      {
        heading: "7. Limitação de responsabilidade",
        paragraphs: [
          "Na máxima medida permitida por lei, o Finkith e seu operador não são responsáveis por danos indiretos, incidentais ou consequenciais decorrentes do uso do serviço, incluindo decisões tomadas com base em dados inseridos por você ou por outros membros do grupo. Isso não limita nenhuma responsabilidade que não possa ser excluída pela legislação de proteção ao consumidor da UE ou pelo CDC brasileiro.",
        ],
      },
      {
        heading: "8. Encerramento",
        paragraphs: [
          "Você pode parar de usar o Finkith e excluir sua conta a qualquer momento. Podemos suspender ou encerrar contas que violem estes Termos.",
        ],
      },
      {
        heading: "9. Lei aplicável",
        paragraphs: [
          "Estes Termos são regidos pelas leis do Brasil, sem prejuízo de quaisquer direitos obrigatórios de proteção ao consumidor que você tenha sob as leis do seu país de residência, caso esteja na UE/Espaço Econômico Europeu.",
        ],
      },
      {
        heading: "10. Alterações nestes Termos",
        paragraphs: [
          "Podemos atualizar estes Termos conforme o serviço evolui. Continuar usando o Finkith após uma alteração significa que você aceita os novos Termos.",
        ],
      },
      {
        heading: "11. Contato",
        paragraphs: [`Dúvidas sobre estes Termos: ${CONTACT_EMAIL}`],
      },
    ],
  },
  "es-ES": {
    title: "Términos de Servicio",
    lastUpdated: "Última actualización: 6 de agosto de 2026",
    intro:
      "Estos Términos regulan tu uso de Finkith. Al crear una cuenta o usar la app, los aceptas. Si no estás de acuerdo, por favor no uses el servicio.",
    sections: [
      {
        heading: "1. Qué es Finkith",
        paragraphs: [
          "Finkith es una herramienta para llevar el control de ingresos y facturas compartidos dentro de un hogar o grupo. No es un banco, no se conecta a tus cuentas bancarias, no mueve ni custodia dinero, y no es una entidad financiera regulada. Nada de lo que hay en la app constituye asesoramiento financiero, fiscal ni jurídico.",
        ],
      },
      {
        heading: "2. Cuentas y grupos",
        paragraphs: [
          "Necesitas una cuenta para usar Finkith, y eres responsable de mantener seguras tus credenciales de acceso y de toda la actividad realizada en tu cuenta.",
          "Los grupos son espacios compartidos: cuando creas un grupo o te unes a uno, los demás miembros pueden ver los datos de ingresos y facturas registrados en él. Los administradores del grupo pueden gestionar a los miembros y expulsar a personas del grupo.",
        ],
      },
      {
        heading: "3. Uso aceptable",
        paragraphs: [
          "No uses Finkith para almacenar o compartir contenido ilícito, hacerte pasar por otra persona, intentar acceder a cuentas o grupos de otros usuarios sin autorización, o interferir en el funcionamiento normal del servicio.",
        ],
      },
      {
        heading: "4. Precios",
        paragraphs: [
          "Finkith es gratuito por ahora. Puede que introduzcamos planes o funciones de pago en el futuro; si lo hacemos, avisaremos con antelación a los usuarios existentes antes de cualquier cambio que les afecte.",
        ],
      },
      {
        heading: "5. Tus datos",
        paragraphs: [
          "Los datos que introduces en Finkith son tuyos. Consulta nuestra Política de Privacidad para saber cómo los tratamos. Puedes eliminar tus datos en cualquier momento desde Ajustes.",
        ],
      },
      {
        heading: "6. Disponibilidad",
        paragraphs: [
          'Finkith se ofrece "tal cual" y "según disponibilidad". No garantizamos que el servicio sea ininterrumpido ni esté libre de errores, y podemos modificar o discontinuar funciones.',
        ],
      },
      {
        heading: "7. Limitación de responsabilidad",
        paragraphs: [
          "En la máxima medida permitida por la ley, Finkith y su operador no son responsables de daños indirectos, incidentales o consecuentes derivados del uso del servicio, incluidas las decisiones tomadas a partir de datos introducidos por ti o por otros miembros del grupo. Esto no limita ninguna responsabilidad que no pueda excluirse conforme a la normativa de protección al consumidor aplicable de la UE o de Brasil (CDC).",
        ],
      },
      {
        heading: "8. Finalización",
        paragraphs: [
          "Puedes dejar de usar Finkith y eliminar tu cuenta en cualquier momento. Podemos suspender o cancelar cuentas que incumplan estos Términos.",
        ],
      },
      {
        heading: "9. Legislación aplicable",
        paragraphs: [
          "Estos Términos se rigen por las leyes de Brasil, sin perjuicio de los derechos imperativos de protección al consumidor que te correspondan conforme a la legislación de tu país de residencia si te encuentras en la UE/EEE.",
        ],
      },
      {
        heading: "10. Cambios en estos Términos",
        paragraphs: [
          "Podemos actualizar estos Términos a medida que el servicio evolucione. Seguir usando Finkith tras un cambio implica que aceptas los Términos actualizados.",
        ],
      },
      {
        heading: "11. Contacto",
        paragraphs: [`Dudas sobre estos Términos: ${CONTACT_EMAIL}`],
      },
    ],
  },
};
