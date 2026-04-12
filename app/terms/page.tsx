import Link from 'next/link'
import { ArrowLeft, FileText } from 'lucide-react'

export const metadata = {
  title: 'CGU — KamContent',
  description: "Conditions générales d'utilisation de KamContent.",
}

const sections = [
  { id: 'objet', label: 'Objet' },
  { id: 'acces', label: 'Accès au service' },
  { id: 'compte', label: 'Compte utilisateur' },
  { id: 'utilisation', label: 'Utilisation' },
  { id: 'propriete', label: 'Propriété intellectuelle' },
  { id: 'donnees', label: 'Données personnelles' },
  { id: 'responsabilite', label: 'Responsabilité' },
  { id: 'resiliation', label: 'Résiliation' },
  { id: 'modifications', label: 'Modifications' },
  { id: 'droit', label: 'Droit applicable' },
]

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#07090F] flex flex-col">
      {/* Header */}
      <header className="border-b border-white/[0.06] sticky top-0 bg-[#07090F]/90 backdrop-blur-md z-10">
        <div className="max-w-5xl mx-auto px-5 h-14 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2.5 cursor-pointer">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="KamContent" className="h-7 w-7 rounded-xl" />
            <span className="font-display font-bold text-white text-[15px] tracking-tight">KamContent</span>
          </Link>
          <span className="text-white/20 text-sm">/</span>
          <span className="text-white/40 text-sm">CGU</span>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 px-5 py-14">
        <div className="max-w-5xl mx-auto">
          <div className="flex gap-12">

            {/* Sidebar nav */}
            <aside className="hidden lg:block w-52 shrink-0">
              <div className="sticky top-24">
                <div className="flex items-center gap-2 mb-5">
                  <FileText className="h-4 w-4 text-[#29AAE2]" />
                  <span className="text-xs font-semibold text-white/40 uppercase tracking-wider">Sommaire</span>
                </div>
                <nav className="space-y-1">
                  {sections.map((s) => (
                    <a
                      key={s.id}
                      href={`#${s.id}`}
                      className="block text-sm text-white/35 hover:text-white/70 py-1 transition-colors"
                    >
                      {s.label}
                    </a>
                  ))}
                </nav>
                <div className="mt-8 pt-6 border-t border-white/[0.06]">
                  <Link
                    href="/"
                    className="flex items-center gap-2 text-xs text-white/30 hover:text-white/60 transition-colors"
                  >
                    <ArrowLeft className="h-3 w-3" />
                    Retour à l&apos;accueil
                  </Link>
                </div>
              </div>
            </aside>

            {/* Main doc */}
            <div className="flex-1 min-w-0">
              {/* Title */}
              <div className="mb-10 pb-8 border-b border-white/[0.06]">
                <div className="inline-flex items-center gap-2 bg-[#29AAE2]/10 border border-[#29AAE2]/20 rounded-full px-3 py-1 mb-5">
                  <span className="text-[11px] font-semibold text-[#29AAE2] uppercase tracking-wider">Document légal</span>
                </div>
                <h1 className="font-display text-3xl md:text-4xl font-bold text-white tracking-tight text-balance mb-3">
                  Conditions générales d&apos;utilisation
                </h1>
                <p className="text-white/40 text-sm">
                  Dernière mise à jour : 12 avril 2026 · Version 1.0
                </p>
              </div>

              {/* Intro */}
              <div className="bg-[#29AAE2]/[0.06] border border-[#29AAE2]/15 rounded-2xl p-5 mb-10">
                <p className="text-white/60 text-[15px] leading-relaxed">
                  Bienvenue sur <strong className="text-white/80">KamContent</strong>. En accédant à notre service, tu acceptes les présentes conditions générales d&apos;utilisation. Lis-les attentivement avant d&apos;utiliser la plateforme.
                </p>
              </div>

              {/* Sections */}
              <div className="space-y-12">

                <section id="objet">
                  <h2 className="font-display text-xl font-bold text-white mb-4 tracking-tight">1. Objet</h2>
                  <div className="prose-dark space-y-3">
                    <p className="text-white/55 text-[15px] leading-relaxed">
                      KamContent est une plateforme SaaS d&apos;aide à la création de contenu destinée aux créateurs de contenu sur les réseaux sociaux (TikTok, YouTube, Instagram, LinkedIn, etc.). Le service permet de générer des idées de contenu, des scripts à lire face caméra, et de planifier un calendrier éditorial personnalisé grâce à l&apos;intelligence artificielle.
                    </p>
                    <p className="text-white/55 text-[15px] leading-relaxed">
                      KamContent n&apos;est pas un outil de génération de vidéos. La plateforme fournit exclusivement des scripts textuels et des idées structurées que le créateur filme lui-même.
                    </p>
                    <p className="text-white/55 text-[15px] leading-relaxed">
                      Le service est actuellement en <strong className="text-white/70">phase bêta</strong> et est accessible gratuitement. Des plans tarifaires seront introduits ultérieurement et communiqués aux utilisateurs avec un préavis suffisant.
                    </p>
                  </div>
                </section>

                <section id="acces">
                  <h2 className="font-display text-xl font-bold text-white mb-4 tracking-tight">2. Accès au service</h2>
                  <div className="space-y-3">
                    <p className="text-white/55 text-[15px] leading-relaxed">
                      L&apos;accès à KamContent est ouvert à toute personne physique âgée d&apos;au moins 16 ans. En t&apos;inscrivant, tu déclares remplir cette condition.
                    </p>
                    <p className="text-white/55 text-[15px] leading-relaxed">
                      Le service est accessible via le site web à l&apos;adresse <strong className="text-white/70">kamcontent.app</strong>. KamContent se réserve le droit de suspendre temporairement l&apos;accès pour maintenance, mise à jour ou en cas de force majeure, sans préavis ni indemnité.
                    </p>
                    <p className="text-white/55 text-[15px] leading-relaxed">
                      Pendant la période bêta, l&apos;accès est entièrement gratuit. Aucune carte bancaire n&apos;est requise à l&apos;inscription.
                    </p>
                  </div>
                </section>

                <section id="compte">
                  <h2 className="font-display text-xl font-bold text-white mb-4 tracking-tight">3. Compte utilisateur</h2>
                  <div className="space-y-3">
                    <p className="text-white/55 text-[15px] leading-relaxed">
                      Pour utiliser KamContent, tu dois créer un compte en fournissant une adresse e-mail valide et un mot de passe. Tu es responsable de la confidentialité de tes identifiants de connexion.
                    </p>
                    <ul className="space-y-2 pl-4">
                      {[
                        "Ne communique pas tes identifiants à des tiers.",
                        "Notifie immédiatement KamContent en cas d'accès non autorisé à ton compte.",
                        "Un seul compte est autorisé par utilisateur. Les comptes multiples peuvent être supprimés.",
                        "Tu es seul responsable des actions effectuées depuis ton compte.",
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-white/55 text-[15px] leading-relaxed">
                          <span className="mt-2 h-1 w-1 rounded-full bg-[#29AAE2] shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>

                <section id="utilisation">
                  <h2 className="font-display text-xl font-bold text-white mb-4 tracking-tight">4. Utilisation acceptable</h2>
                  <div className="space-y-3">
                    <p className="text-white/55 text-[15px] leading-relaxed">
                      Tu t&apos;engages à utiliser KamContent de manière licite et conforme à ces CGU. Sont notamment interdits :
                    </p>
                    <ul className="space-y-2 pl-4">
                      {[
                        "Générer du contenu illégal, haineux, discriminatoire ou portant atteinte aux droits de tiers.",
                        "Utiliser le service à des fins commerciales de revente sans accord préalable écrit.",
                        "Tenter de contourner les mécanismes de sécurité de la plateforme.",
                        "Utiliser des robots, scripts ou outils automatisés pour extraire massivement des données (scraping).",
                        "Usurper l'identité d'un autre utilisateur ou d'une personne morale.",
                        "Perturber le fonctionnement du service ou des serveurs.",
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-white/55 text-[15px] leading-relaxed">
                          <span className="mt-2 h-1 w-1 rounded-full bg-[#29AAE2] shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <p className="text-white/55 text-[15px] leading-relaxed">
                      KamContent se réserve le droit de suspendre ou supprimer tout compte ne respectant pas ces règles, sans préavis ni remboursement.
                    </p>
                  </div>
                </section>

                <section id="propriete">
                  <h2 className="font-display text-xl font-bold text-white mb-4 tracking-tight">5. Propriété intellectuelle</h2>
                  <div className="space-y-3">
                    <p className="text-white/55 text-[15px] leading-relaxed">
                      <strong className="text-white/70">Contenus de la plateforme :</strong> L&apos;ensemble des éléments constituant la plateforme KamContent (design, code, algorithmes, marques, logos, textes) est la propriété exclusive de KamContent ou de ses partenaires et est protégé par les lois sur la propriété intellectuelle.
                    </p>
                    <p className="text-white/55 text-[15px] leading-relaxed">
                      <strong className="text-white/70">Contenu généré :</strong> Les idées et scripts générés via la plateforme à partir de tes saisies t&apos;appartiennent. KamContent ne revendique aucun droit de propriété sur les contenus que tu produis à l&apos;aide du service. Tu restes seul responsable de l&apos;utilisation de ces contenus.
                    </p>
                    <p className="text-white/55 text-[15px] leading-relaxed">
                      <strong className="text-white/70">Licence d&apos;utilisation :</strong> KamContent t&apos;accorde une licence personnelle, non exclusive, non transférable et révocable pour accéder à et utiliser le service conformément aux présentes CGU.
                    </p>
                  </div>
                </section>

                <section id="donnees">
                  <h2 className="font-display text-xl font-bold text-white mb-4 tracking-tight">6. Données personnelles</h2>
                  <div className="space-y-3">
                    <p className="text-white/55 text-[15px] leading-relaxed">
                      Le traitement de tes données personnelles est décrit en détail dans notre{' '}
                      <Link href="/privacy" className="text-[#29AAE2] hover:underline">
                        Politique de confidentialité
                      </Link>
                      . En utilisant KamContent, tu acceptes les pratiques qui y sont décrites.
                    </p>
                    <p className="text-white/55 text-[15px] leading-relaxed">
                      Conformément au RGPD (Règlement Général sur la Protection des Données), tu disposes d&apos;un droit d&apos;accès, de rectification, d&apos;effacement et de portabilité de tes données. Pour exercer ces droits, contacte-nous à <strong className="text-white/70">privacy@kamcontent.app</strong>.
                    </p>
                  </div>
                </section>

                <section id="responsabilite">
                  <h2 className="font-display text-xl font-bold text-white mb-4 tracking-tight">7. Limitation de responsabilité</h2>
                  <div className="space-y-3">
                    <p className="text-white/55 text-[15px] leading-relaxed">
                      KamContent est fourni «&nbsp;en l&apos;état&nbsp;» sans garantie de résultat. Dans les limites permises par la loi applicable :
                    </p>
                    <ul className="space-y-2 pl-4">
                      {[
                        "KamContent ne garantit pas que le service sera disponible sans interruption ni erreur.",
                        "Les contenus générés par IA sont fournis à titre indicatif. Tu es responsable de leur vérification et de leur utilisation.",
                        "KamContent ne saurait être tenu responsable des pertes de données, manque à gagner ou préjudice indirect résultant de l'utilisation du service.",
                        "La responsabilité totale de KamContent ne saurait excéder le montant payé par l'utilisateur au cours des 12 derniers mois (ou 0 € pendant la période bêta gratuite).",
                      ].map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-white/55 text-[15px] leading-relaxed">
                          <span className="mt-2 h-1 w-1 rounded-full bg-[#29AAE2] shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>

                <section id="resiliation">
                  <h2 className="font-display text-xl font-bold text-white mb-4 tracking-tight">8. Résiliation</h2>
                  <div className="space-y-3">
                    <p className="text-white/55 text-[15px] leading-relaxed">
                      Tu peux supprimer ton compte à tout moment depuis les paramètres de ton profil ou en nous contactant à <strong className="text-white/70">support@kamcontent.app</strong>. La suppression entraîne la suppression définitive de tes données dans un délai de 30 jours.
                    </p>
                    <p className="text-white/55 text-[15px] leading-relaxed">
                      KamContent peut résilier ou suspendre ton accès en cas de violation des présentes CGU, sans préavis. En cas de fin de la période bêta ou d&apos;arrêt du service, un préavis de 30 jours sera communiqué par e-mail.
                    </p>
                  </div>
                </section>

                <section id="modifications">
                  <h2 className="font-display text-xl font-bold text-white mb-4 tracking-tight">9. Modifications des CGU</h2>
                  <div className="space-y-3">
                    <p className="text-white/55 text-[15px] leading-relaxed">
                      KamContent se réserve le droit de modifier les présentes CGU à tout moment. En cas de modification substantielle, tu seras notifié par e-mail ou via une notification dans l&apos;application au moins 14 jours avant l&apos;entrée en vigueur des nouvelles conditions.
                    </p>
                    <p className="text-white/55 text-[15px] leading-relaxed">
                      La poursuite de l&apos;utilisation du service après la date d&apos;entrée en vigueur vaut acceptation des nouvelles conditions. Si tu n&apos;acceptes pas les modifications, tu peux supprimer ton compte avant la date d&apos;effet.
                    </p>
                  </div>
                </section>

                <section id="droit">
                  <h2 className="font-display text-xl font-bold text-white mb-4 tracking-tight">10. Droit applicable et litiges</h2>
                  <div className="space-y-3">
                    <p className="text-white/55 text-[15px] leading-relaxed">
                      Les présentes CGU sont régies par le droit français. En cas de litige, une solution amiable sera recherchée en priorité. À défaut d&apos;accord, les tribunaux compétents du ressort du siège social de KamContent seront seuls compétents.
                    </p>
                    <p className="text-white/55 text-[15px] leading-relaxed">
                      Conformément à l&apos;article L.616-1 du Code de la consommation, tu peux recourir gratuitement à un médiateur de la consommation en cas de litige non résolu. Pour toute question, contacte-nous à <strong className="text-white/70">contact@kamcontent.app</strong>.
                    </p>
                  </div>
                </section>

              </div>

              {/* Bottom nav */}
              <div className="mt-14 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <Link
                  href="/privacy"
                  className="text-[#29AAE2] text-sm hover:underline"
                >
                  Lire notre politique de confidentialité →
                </Link>
                <Link
                  href="/"
                  className="flex items-center gap-2 text-sm text-white/35 hover:text-white/60 transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Retour à l&apos;accueil
                </Link>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/[0.05] py-5">
        <p className="text-center text-xs text-white/20">
          © {new Date().getFullYear()} KamContent — Tous droits réservés
        </p>
      </footer>
    </div>
  )
}
