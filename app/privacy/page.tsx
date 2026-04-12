import Link from 'next/link'
import { ArrowLeft, Shield } from 'lucide-react'

export const metadata = {
  title: 'Confidentialité — KamContent',
  description: 'Politique de confidentialité de KamContent.',
}

const sections = [
  { id: 'responsable', label: 'Responsable du traitement' },
  { id: 'collecte', label: 'Données collectées' },
  { id: 'finalites', label: 'Finalités du traitement' },
  { id: 'base-legale', label: 'Base légale' },
  { id: 'conservation', label: 'Durée de conservation' },
  { id: 'partage', label: 'Partage des données' },
  { id: 'droits', label: 'Vos droits (RGPD)' },
  { id: 'cookies', label: 'Cookies' },
  { id: 'securite', label: 'Sécurité' },
  { id: 'contact', label: 'Contact' },
]

export default function PrivacyPage() {
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
          <span className="text-white/40 text-sm">Confidentialité</span>
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
                  <Shield className="h-4 w-4 text-[#29AAE2]" />
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
                  Politique de confidentialité
                </h1>
                <p className="text-white/40 text-sm">
                  Dernière mise à jour : 12 avril 2026 · Version 1.0 · Conforme RGPD
                </p>
              </div>

              {/* Intro */}
              <div className="bg-[#29AAE2]/[0.06] border border-[#29AAE2]/15 rounded-2xl p-5 mb-10">
                <p className="text-white/60 text-[15px] leading-relaxed">
                  <strong className="text-white/80">KamContent</strong> s&apos;engage à protéger ta vie privée. Cette politique explique quelles données nous collectons, pourquoi, et comment tu peux les contrôler. Nous appliquons le principe de minimisation des données : nous ne collectons que ce qui est strictement nécessaire.
                </p>
              </div>

              {/* Sections */}
              <div className="space-y-12">

                <section id="responsable">
                  <h2 className="font-display text-xl font-bold text-white mb-4 tracking-tight">1. Responsable du traitement</h2>
                  <div className="space-y-3">
                    <p className="text-white/55 text-[15px] leading-relaxed">
                      Le responsable du traitement de tes données personnelles est la société éditrice de la plateforme KamContent.
                    </p>
                    <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4 space-y-1.5">
                      {[
                        ['Plateforme', 'KamContent'],
                        ['Contact', 'privacy@kamcontent.app'],
                        ['Délégué à la protection des données (DPO)', 'dpo@kamcontent.app'],
                      ].map(([label, value]) => (
                        <div key={label} className="flex gap-3 text-sm">
                          <span className="text-white/35 w-48 shrink-0">{label}</span>
                          <span className="text-white/65">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                <section id="collecte">
                  <h2 className="font-display text-xl font-bold text-white mb-4 tracking-tight">2. Données collectées</h2>
                  <div className="space-y-4">
                    <p className="text-white/55 text-[15px] leading-relaxed">
                      Nous collectons uniquement les données nécessaires au fonctionnement du service :
                    </p>

                    <div className="space-y-3">
                      {[
                        {
                          title: 'Données de compte',
                          items: ['Adresse e-mail', 'Nom ou pseudo (optionnel)', 'Mot de passe (chiffré, jamais stocké en clair)'],
                        },
                        {
                          title: 'Données d\'utilisation',
                          items: ['Idées et scripts générés via le service', 'Préférences de plateforme (TikTok, YouTube, etc.)', 'Historique des sessions', 'Calendrier éditorial créé sur la plateforme'],
                        },
                        {
                          title: 'Données techniques',
                          items: ['Adresse IP (anonymisée après 90 jours)', 'Type de navigateur et système d\'exploitation', 'Pages visitées et durée des sessions', 'Données de performance et d\'erreurs'],
                        },
                      ].map((group) => (
                        <div key={group.title} className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4">
                          <p className="text-white/70 text-sm font-semibold mb-3">{group.title}</p>
                          <ul className="space-y-1.5">
                            {group.items.map((item) => (
                              <li key={item} className="flex items-start gap-2 text-sm text-white/50">
                                <span className="mt-2 h-1 w-1 rounded-full bg-[#29AAE2] shrink-0" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>

                    <p className="text-white/55 text-[15px] leading-relaxed">
                      Nous ne collectons pas de données de paiement (aucun paiement requis pendant la bêta). Nous ne collectons pas de données sensibles au sens de l&apos;article 9 du RGPD.
                    </p>
                  </div>
                </section>

                <section id="finalites">
                  <h2 className="font-display text-xl font-bold text-white mb-4 tracking-tight">3. Finalités du traitement</h2>
                  <div className="space-y-3">
                    <p className="text-white/55 text-[15px] leading-relaxed">
                      Tes données sont traitées pour les finalités suivantes :
                    </p>
                    <ul className="space-y-2.5 pl-4">
                      {[
                        { title: 'Fourniture du service', desc: 'Création et gestion de ton compte, génération de contenu IA, sauvegarde de ton calendrier éditorial.' },
                        { title: 'Amélioration du service', desc: 'Analyse des usages pour améliorer les fonctionnalités et la pertinence des suggestions IA.' },
                        { title: 'Support utilisateur', desc: 'Réponse à tes demandes d\'aide et résolution de problèmes techniques.' },
                        { title: 'Communication', desc: 'Envoi de notifications importantes (changements de CGU, fin de bêta, nouvelles fonctionnalités). Pas de marketing sans ton consentement explicite.' },
                        { title: 'Sécurité', desc: 'Détection des fraudes, protection contre les accès non autorisés, maintenance de la sécurité.' },
                        { title: 'Obligations légales', desc: 'Respect des obligations légales applicables (conservation de certaines données comptables, réponse aux demandes judiciaires).' },
                      ].map((item) => (
                        <li key={item.title} className="flex items-start gap-2.5 text-[15px] leading-relaxed">
                          <span className="mt-2 h-1 w-1 rounded-full bg-[#29AAE2] shrink-0" />
                          <span>
                            <strong className="text-white/70">{item.title} :</strong>{' '}
                            <span className="text-white/55">{item.desc}</span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>

                <section id="base-legale">
                  <h2 className="font-display text-xl font-bold text-white mb-4 tracking-tight">4. Base légale du traitement</h2>
                  <div className="space-y-3">
                    <p className="text-white/55 text-[15px] leading-relaxed">
                      Conformément au RGPD, chaque traitement repose sur une base légale :
                    </p>
                    <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl overflow-hidden">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-white/[0.06]">
                            <th className="text-left text-white/40 font-medium px-4 py-3">Finalité</th>
                            <th className="text-left text-white/40 font-medium px-4 py-3">Base légale</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.04]">
                          {[
                            ['Fourniture du service', 'Exécution du contrat'],
                            ['Support utilisateur', 'Exécution du contrat'],
                            ['Amélioration du service', 'Intérêt légitime'],
                            ['Sécurité et lutte contre la fraude', 'Intérêt légitime'],
                            ['Communications marketing', 'Consentement'],
                            ['Obligations légales', 'Obligation légale'],
                          ].map(([finalite, base]) => (
                            <tr key={finalite}>
                              <td className="px-4 py-3 text-white/55">{finalite}</td>
                              <td className="px-4 py-3 text-[#29AAE2]">{base}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </section>

                <section id="conservation">
                  <h2 className="font-display text-xl font-bold text-white mb-4 tracking-tight">5. Durée de conservation</h2>
                  <div className="space-y-3">
                    <ul className="space-y-2.5 pl-4">
                      {[
                        { label: 'Données de compte actif', value: 'Durée du contrat + 3 ans après la dernière connexion' },
                        { label: 'Compte supprimé', value: '30 jours après suppression, puis effacement définitif' },
                        { label: 'Données de facturation', value: '10 ans (obligation légale comptable) — non applicable en bêta' },
                        { label: 'Logs techniques', value: '12 mois glissants' },
                        { label: 'Adresses IP', value: 'Anonymisées après 90 jours' },
                        { label: 'Cookies analytics', value: '13 mois maximum' },
                      ].map((item) => (
                        <li key={item.label} className="flex items-start gap-2.5 text-[15px] leading-relaxed">
                          <span className="mt-2 h-1 w-1 rounded-full bg-[#29AAE2] shrink-0" />
                          <span>
                            <strong className="text-white/70">{item.label} :</strong>{' '}
                            <span className="text-white/55">{item.value}</span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>

                <section id="partage">
                  <h2 className="font-display text-xl font-bold text-white mb-4 tracking-tight">6. Partage des données</h2>
                  <div className="space-y-3">
                    <p className="text-white/55 text-[15px] leading-relaxed">
                      Nous ne vendons jamais tes données personnelles. Elles peuvent être partagées uniquement avec :
                    </p>
                    <ul className="space-y-2.5 pl-4">
                      {[
                        { title: 'Prestataires techniques', desc: 'Hébergement, base de données, envoi d\'e-mails — dans le cadre de contrats de sous-traitance conformes au RGPD.' },
                        { title: 'Fournisseurs IA', desc: 'Les prompts envoyés aux modèles d\'IA pour générer du contenu. Ces échanges sont soumis aux politiques de confidentialité des prestataires IA concernés.' },
                        { title: 'Outils d\'analyse', desc: 'Données anonymisées ou pseudonymisées uniquement, pour mesurer l\'usage de la plateforme.' },
                        { title: 'Autorités légales', desc: 'Sur réquisition judiciaire ou obligation légale uniquement.' },
                      ].map((item) => (
                        <li key={item.title} className="flex items-start gap-2.5 text-[15px] leading-relaxed">
                          <span className="mt-2 h-1 w-1 rounded-full bg-[#29AAE2] shrink-0" />
                          <span>
                            <strong className="text-white/70">{item.title} :</strong>{' '}
                            <span className="text-white/55">{item.desc}</span>
                          </span>
                        </li>
                      ))}
                    </ul>
                    <p className="text-white/55 text-[15px] leading-relaxed">
                      Tous nos prestataires situés hors de l&apos;UE sont encadrés par des garanties appropriées (clauses contractuelles types de la Commission européenne ou décision d&apos;adéquation).
                    </p>
                  </div>
                </section>

                <section id="droits">
                  <h2 className="font-display text-xl font-bold text-white mb-4 tracking-tight">7. Tes droits (RGPD)</h2>
                  <div className="space-y-3">
                    <p className="text-white/55 text-[15px] leading-relaxed">
                      Conformément au RGPD, tu disposes des droits suivants :
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { title: 'Droit d\'accès', desc: 'Obtenir une copie de toutes les données te concernant.' },
                        { title: 'Droit de rectification', desc: 'Corriger des données inexactes ou incomplètes.' },
                        { title: 'Droit à l\'effacement', desc: 'Demander la suppression de tes données (droit à l\'oubli).' },
                        { title: 'Droit à la portabilité', desc: 'Recevoir tes données dans un format structuré et lisible par machine.' },
                        { title: 'Droit d\'opposition', desc: 'T\'opposer au traitement basé sur l\'intérêt légitime.' },
                        { title: 'Droit à la limitation', desc: 'Limiter temporairement le traitement de tes données.' },
                      ].map((item) => (
                        <div key={item.title} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
                          <p className="text-white/70 text-sm font-semibold mb-1">{item.title}</p>
                          <p className="text-white/45 text-sm">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                    <p className="text-white/55 text-[15px] leading-relaxed">
                      Pour exercer ces droits, envoie ta demande à <strong className="text-white/70">privacy@kamcontent.app</strong> avec une preuve d&apos;identité. Nous répondons dans un délai de 30 jours.
                    </p>
                    <p className="text-white/55 text-[15px] leading-relaxed">
                      Tu disposes également du droit d&apos;introduire une réclamation auprès de la <strong className="text-white/70">CNIL</strong> (Commission Nationale de l&apos;Informatique et des Libertés) : <strong className="text-white/70">www.cnil.fr</strong>.
                    </p>
                  </div>
                </section>

                <section id="cookies">
                  <h2 className="font-display text-xl font-bold text-white mb-4 tracking-tight">8. Cookies et traceurs</h2>
                  <div className="space-y-3">
                    <p className="text-white/55 text-[15px] leading-relaxed">
                      KamContent utilise des cookies pour le bon fonctionnement du service. Voici les catégories utilisées :
                    </p>
                    <ul className="space-y-2.5 pl-4">
                      {[
                        { title: 'Cookies essentiels', desc: 'Nécessaires au fonctionnement de la plateforme (session, authentification). Ces cookies ne peuvent pas être désactivés.' },
                        { title: 'Cookies analytics', desc: 'Mesure de l\'audience et analyse des comportements d\'utilisation (données anonymisées). Soumis à ton consentement.' },
                        { title: 'Cookies de préférences', desc: 'Mémorisation de tes préférences d\'interface (thème, langue). Soumis à ton consentement.' },
                      ].map((item) => (
                        <li key={item.title} className="flex items-start gap-2.5 text-[15px] leading-relaxed">
                          <span className="mt-2 h-1 w-1 rounded-full bg-[#29AAE2] shrink-0" />
                          <span>
                            <strong className="text-white/70">{item.title} :</strong>{' '}
                            <span className="text-white/55">{item.desc}</span>
                          </span>
                        </li>
                      ))}
                    </ul>
                    <p className="text-white/55 text-[15px] leading-relaxed">
                      Tu peux gérer tes préférences de cookies à tout moment depuis le bandeau de consentement ou les paramètres de ton navigateur.
                    </p>
                  </div>
                </section>

                <section id="securite">
                  <h2 className="font-display text-xl font-bold text-white mb-4 tracking-tight">9. Sécurité des données</h2>
                  <div className="space-y-3">
                    <p className="text-white/55 text-[15px] leading-relaxed">
                      KamContent met en œuvre des mesures techniques et organisationnelles appropriées pour protéger tes données :
                    </p>
                    <ul className="space-y-2 pl-4">
                      {[
                        'Chiffrement des données en transit (TLS 1.3) et au repos (AES-256)',
                        'Mots de passe stockés sous forme de hash (bcrypt)',
                        'Accès aux données limité au personnel strictement autorisé',
                        'Surveillance continue des accès et journalisation des événements sensibles',
                        'Audits de sécurité réguliers',
                        'Plan de réponse aux incidents de sécurité',
                      ].map((item) => (
                        <li key={item} className="flex items-start gap-2 text-white/55 text-[15px] leading-relaxed">
                          <span className="mt-2 h-1 w-1 rounded-full bg-[#29AAE2] shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <p className="text-white/55 text-[15px] leading-relaxed">
                      En cas de violation de données susceptible d&apos;engendrer un risque pour tes droits et libertés, nous t&apos;en informerons dans les meilleurs délais conformément à l&apos;article 34 du RGPD.
                    </p>
                  </div>
                </section>

                <section id="contact">
                  <h2 className="font-display text-xl font-bold text-white mb-4 tracking-tight">10. Contact</h2>
                  <div className="space-y-3">
                    <p className="text-white/55 text-[15px] leading-relaxed">
                      Pour toute question relative à cette politique de confidentialité ou à l&apos;exercice de tes droits :
                    </p>
                    <div className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4 space-y-2">
                      {[
                        ['Questions générales', 'contact@kamcontent.app'],
                        ['Protection des données (RGPD)', 'privacy@kamcontent.app'],
                        ['DPO', 'dpo@kamcontent.app'],
                      ].map(([label, value]) => (
                        <div key={label} className="flex gap-3 text-sm">
                          <span className="text-white/35 w-52 shrink-0">{label}</span>
                          <span className="text-[#29AAE2]">{value}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-white/55 text-[15px] leading-relaxed">
                      Délai de réponse garanti : <strong className="text-white/70">30 jours maximum</strong> à compter de la réception de ta demande.
                    </p>
                  </div>
                </section>

              </div>

              {/* Bottom nav */}
              <div className="mt-14 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <Link
                  href="/terms"
                  className="text-[#29AAE2] text-sm hover:underline"
                >
                  Lire nos conditions générales d&apos;utilisation →
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
