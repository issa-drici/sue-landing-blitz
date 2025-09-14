import { Link } from "react-router-dom";

const Confidentialite = () => {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <Link 
            to="/" 
            className="text-foreground/70 hover:text-foreground transition-opacity text-sm"
          >
            ← Retour à l'accueil
          </Link>
        </div>
        
        <div className="space-y-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Politique de confidentialité - Sue</h1>
            <p className="text-foreground/70 text-sm">
              Dernière mise à jour : 14/09/2025
            </p>
          </div>
          
          <div className="space-y-8 text-foreground/90 leading-relaxed">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
              <p className="mb-4">
                Cette politique de confidentialité décrit comment Sue ("nous", "notre" ou "nos") collecte, 
                utilise, stocke et protège vos informations personnelles lorsque vous utilisez notre application mobile Sue disponible sur l'App Store d'Apple.
              </p>
              <p>
                En utilisant notre application, vous acceptez les pratiques décrites dans cette politique de confidentialité. 
                Si vous n'acceptez pas cette politique, veuillez ne pas utiliser notre application.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Responsable du traitement</h2>
              <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                <p><strong>Nom de l'entreprise :</strong> Issa Drici - Sue</p>
                <p><strong>Adresse :</strong> issadricipro@gmail.com</p>
                <p><strong>Email de contact :</strong> issadricipro@gmail.com</p>
                <p><strong>Représentant légal :</strong> Issa Drici</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Informations que nous collectons</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-medium mb-3">3.1 Informations personnelles que vous nous fournissez</h3>
                  <p className="mb-3">Lors de la création de votre compte, nous collectons :</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Prénom</strong> : Nécessaire pour personnaliser votre expérience et permettre aux autres joueurs de vous identifier</li>
                    <li><strong>Nom</strong> : Utilisé pour créer votre profil et faciliter les invitations entre amis</li>
                    <li><strong>Adresse e-mail</strong> : Requise pour créer votre compte, vous envoyer des notifications importantes et récupérer votre mot de passe</li>
                    <li><strong>Mot de passe</strong> : Crypté et stocké de manière sécurisée (nous ne pouvons pas voir votre mot de passe en clair)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-3">3.2 Informations collectées automatiquement</h3>
                  <p className="mb-3">Nous collectons automatiquement certaines informations lorsque vous utilisez notre application :</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Informations sur l'appareil</strong> : Modèle d'appareil, système d'exploitation, version de l'application</li>
                    <li><strong>Données d'utilisation</strong> : Fonctionnalités utilisées, durée des sessions, fréquence d'utilisation</li>
                    <li><strong>Adresse IP</strong> : Collectée de manière anonymisée pour des raisons de sécurité</li>
                    <li><strong>Identifiants uniques</strong> : Identifiant publicitaire de l'appareil (IDFA) si vous y consentez</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-3">3.3 Photos et médias</h3>
                  <p>Notre application ne collecte pas de photos ou de médias uploadés par les utilisateurs.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Base légale du traitement (RGPD)</h2>
              <p className="mb-4">Nous traitons vos données personnelles sur les bases légales suivantes :</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Consentement</strong> : Pour les données optionnelles et les communications marketing</li>
                <li><strong>Exécution du contrat</strong> : Pour fournir les services de l'application (création de matchs, invitations)</li>
                <li><strong>Intérêt légitime</strong> : Pour améliorer nos services et assurer la sécurité</li>
                <li><strong>Obligation légale</strong> : Pour respecter les exigences légales et réglementaires</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Utilisation de vos informations</h2>
              <p className="mb-4">Nous utilisons vos informations personnelles pour :</p>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-medium mb-2">5.1 Fonctionnalités principales</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Créer et gérer votre compte utilisateur</li>
                    <li>Vous permettre de créer, organiser et participer à des matchs</li>
                    <li>Faciliter l'invitation d'amis et la communication entre joueurs</li>
                    <li>Personnaliser votre expérience dans l'application</li>
                    <li>Vous proposer des matchs pertinents selon vos préférences</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-2">5.2 Communications</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Vous envoyer des notifications importantes concernant vos matchs</li>
                    <li>Vous informer des mises à jour de l'application</li>
                    <li>Répondre à vos demandes de support client</li>
                    <li>Vous envoyer des communications marketing uniquement si vous y consentez explicitement</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-2">5.3 Amélioration des services</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Analyser l'utilisation de l'application pour améliorer nos fonctionnalités</li>
                    <li>Développer de nouvelles fonctionnalités</li>
                    <li>Effectuer des tests A/B pour optimiser l'expérience utilisateur</li>
                    <li>Générer des statistiques anonymisées sur l'utilisation</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-2">5.4 Sécurité et conformité</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Assurer la sécurité de l'application et prévenir la fraude</li>
                    <li>Respecter nos obligations légales et réglementaires</li>
                    <li>Résoudre les litiges et faire respecter nos conditions d'utilisation</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Partage de vos informations</h2>
              <p className="mb-4">
                Nous ne vendons jamais vos informations personnelles à des tiers. Nous pouvons partager vos informations 
                uniquement dans les cas suivants :
              </p>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-medium mb-2">6.1 Avec d'autres utilisateurs</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Votre prénom et nom sont visibles par les autres joueurs dans vos matchs</li>
                    <li>Vos statistiques de jeu peuvent être partagées avec vos amis (si vous y consentez)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-2">6.2 Prestataires de services tiers</h3>
                  <p className="mb-2">Nous pouvons partager vos informations avec des prestataires de confiance qui nous aident à fournir nos services :</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li><strong>Hébergement</strong> : Hostinger</li>
                    <li><strong>Notifications push</strong> : Notifications Apple avec Expo</li>
                  </ul>
                  <p className="mt-2 text-sm text-foreground/80">
                    Ces prestataires sont tenus par des accords de confidentialité stricts et ne peuvent utiliser vos données que pour nous fournir leurs services.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-2">6.3 Obligations légales</h3>
                  <p className="mb-2">Nous pouvons divulguer vos informations si :</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Nous sommes tenus de le faire par la loi ou par une procédure judiciaire</li>
                    <li>Nous devons protéger nos droits, notre propriété ou notre sécurité</li>
                    <li>Nous devons protéger les droits et la sécurité de nos utilisateurs</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-2">6.4 Transferts internationaux</h3>
                  <p>
                    Nous n'utilisons pas de services basés hors de l'Union Européenne. Toutes vos données personnelles 
                    sont traitées et stockées au sein de l'Espace économique européen, garantissant ainsi un niveau de 
                    protection élevé conforme au RGPD.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Sécurité de vos données</h2>
              <p className="mb-4">
                Nous mettons en place des mesures de sécurité techniques et organisationnelles appropriées pour protéger 
                vos informations personnelles :
              </p>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-medium mb-2">7.1 Mesures techniques</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Chiffrement des données en transit et au repos</li>
                    <li>Authentification sécurisée et gestion des sessions</li>
                    <li>Surveillance continue de la sécurité</li>
                    <li>Sauvegardes régulières et sécurisées</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-2">7.2 Mesures organisationnelles</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Accès limité aux données personnelles aux seuls employés autorisés</li>
                    <li>Formation du personnel sur la protection des données</li>
                    <li>Procédures de gestion des incidents de sécurité</li>
                    <li>Audits réguliers de sécurité</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-2">7.3 Limites de sécurité</h3>
                  <p>
                    Aucune méthode de transmission sur Internet ou de stockage électronique n'est 100% sécurisée. 
                    Bien que nous nous efforcions d'utiliser des moyens commercialement acceptables pour protéger vos informations, 
                    nous ne pouvons garantir leur sécurité absolue.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Conservation des données</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-medium mb-2">8.1 Durée de conservation</h3>
                  <p className="mb-2">Nous conservons vos informations personnelles aussi longtemps que nécessaire pour :</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Fournir nos services et maintenir votre compte</li>
                    <li>Respecter nos obligations légales et réglementaires</li>
                    <li>Résoudre les litiges et faire respecter nos accords</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-2">8.2 Suppression des données</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li><strong>Suppression de compte</strong> : Vous pouvez demander la suppression de votre compte à tout moment</li>
                    <li><strong>Suppression automatique</strong> : Les comptes inactifs pendant 3 ans peuvent être supprimés automatiquement</li>
                    <li><strong>Délai de suppression</strong> : Vos données seront supprimées dans un délai de 30 jours après votre demande</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-2">8.3 Données anonymisées</h3>
                  <p>
                    Nous pouvons conserver des données anonymisées à des fins statistiques et d'amélioration de nos services, 
                    même après la suppression de votre compte.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Vos droits (RGPD)</h2>
              <p className="mb-4">
                Conformément au Règlement Général sur la Protection des Données (RGPD) et aux lois applicables, 
                vous disposez des droits suivants :
              </p>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-medium mb-2">9.1 Droit d'accès</h3>
                  <p>Vous pouvez demander une copie de toutes les données personnelles que nous détenons sur vous.</p>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-2">9.2 Droit de rectification</h3>
                  <p>Vous pouvez demander la correction de toute information inexacte ou incomplète.</p>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-2">9.3 Droit à l'effacement ("droit à l'oubli")</h3>
                  <p>Vous pouvez demander la suppression de vos données personnelles dans certaines circonstances.</p>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-2">9.4 Droit à la portabilité</h3>
                  <p>Vous pouvez recevoir vos données dans un format structuré et lisible par machine.</p>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-2">9.5 Droit d'opposition</h3>
                  <p>Vous pouvez vous opposer au traitement de vos données pour des raisons liées à votre situation particulière.</p>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-2">9.6 Droit de limitation</h3>
                  <p>Vous pouvez demander la limitation du traitement de vos données dans certaines circonstances.</p>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-2">9.7 Droit de retrait du consentement</h3>
                  <p>Vous pouvez retirer votre consentement à tout moment pour les traitements basés sur le consentement.</p>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-2">9.8 Exercice de vos droits</h3>
                  <p className="mb-2">
                    Pour exercer ces droits, contactez-nous à : 
                    <a href="mailto:issadricipro@gmail.com" className="text-blue-600 hover:underline ml-1">
                      issadricipro@gmail.com
                    </a>
                  </p>
                  <p className="text-sm text-foreground/80">
                    Nous répondrons à votre demande dans un délai d'un mois. Si votre demande est complexe, 
                    nous pouvons prolonger ce délai de deux mois supplémentaires.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Cookies et technologies similaires</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-medium mb-2">10.1 Cookies dans l'application</h3>
                  <p className="mb-2">Notre application peut utiliser des technologies de suivi similaires aux cookies pour :</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Mémoriser vos préférences</li>
                    <li>Analyser l'utilisation de l'application</li>
                    <li>Améliorer les performances</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-2">10.2 Contrôle des cookies</h3>
                  <p>
                    Vous pouvez contrôler ces paramètres dans les réglages de votre appareil ou dans les paramètres de l'application.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">11. Données des mineurs</h2>
              <p>
                Notre application n'est pas destinée aux enfants de moins de 16 ans. Nous ne collectons pas sciemment 
                d'informations personnelles d'enfants de moins de 16 ans. Si nous apprenons qu'un enfant de moins de 16 ans 
                nous a fourni des informations personnelles, nous supprimerons ces informations de nos serveurs.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">12. Modifications de cette politique</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-medium mb-2">12.1 Mises à jour</h3>
                  <p className="mb-2">Nous pouvons mettre à jour cette politique de confidentialité de temps à autre pour refléter :</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Les changements dans nos pratiques</li>
                    <li>Les modifications légales ou réglementaires</li>
                    <li>Les améliorations de nos services</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-2">12.2 Notification des changements</h3>
                  <p className="mb-2">Nous vous informerons de tout changement important par :</p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Notification dans l'application</li>
                    <li>Email à l'adresse associée à votre compte</li>
                    <li>Publication de la nouvelle politique sur cette page</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-2">12.3 Acceptation des modifications</h3>
                  <p>
                    Votre utilisation continue de l'application après la publication des modifications constitue votre 
                    acceptation de la politique révisée.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">13. Contact et réclamations</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-medium mb-2">13.1 Questions générales</h3>
                  <p className="mb-2">
                    Pour toute question concernant cette politique de confidentialité ou nos pratiques de données :
                  </p>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p><strong>Email :</strong> issadricipro@gmail.com</p>
                    <p><strong>Adresse :</strong> 3 rue des Soeurs Franciscaines, 76620 Le Havre</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-medium mb-2">13.2 Réclamations auprès de l'autorité de contrôle</h3>
                  <p className="mb-2">
                    Si vous estimez que vos droits ne sont pas respectés, vous pouvez déposer une réclamation auprès 
                    de la Commission Nationale de l'Informatique et des Libertés (CNIL) :
                  </p>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p><strong>Site web :</strong> https://www.cnil.fr</p>
                    <p><strong>Adresse :</strong> 3 Place de Fontenoy - TSA 80715 - 75334 PARIS CEDEX 07</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">14. Conformité légale</h2>
              <p className="mb-4">Cette politique de confidentialité est conforme aux exigences suivantes :</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>RGPD</strong> (Règlement Général sur la Protection des Données)</li>
                <li><strong>Loi Informatique et Libertés</strong> française</li>
                <li><strong>Exigences de l'App Store d'Apple</strong></li>
                <li><strong>Directives de l'UE sur la protection des données</strong></li>
              </ul>
            </section>

            <div className="mt-12 pt-8 border-t border-border">
              <p className="text-sm text-foreground/70 text-center">
                Cette politique de confidentialité est entrée en vigueur le 14/09/2025 et remplace toute politique précédente.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Confidentialite;