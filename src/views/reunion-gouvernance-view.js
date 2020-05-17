import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';

class ReunionGouvernanceView extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      debug: {type: Boolean},
      config: {type: Object}
    };
  }

  constructor() {
    super();
    this.name = "Reunion Gouvernance"
    this.debug = true
    this.config = {}
  }

  render(){
    return html`
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
    <link href="css/fontawesome/css/all.css" rel="stylesheet">

    <div class="container-fluid">
    Hello <b>${this.name}</b> from app-element
    </div>


    <div ?hidden = "${!this.debug}">
    <hr>
    https://labdsurlholacracy.com/bande-dessinee-holacracy#page-80-81<br>
    En réunion de gouvernance, on ne parle que des rôles.<br>
    La gouvernance est une nouvelle discipline qui traite de la façon de gérer le pouvoir. Il n'y est pas question de relation humaines, mais
    du corps de l'organisation, ses organes, ses rôles.<br>
    Travailler DANS l'organisation, c'est prendre en charge des opérations.<br>
    Travailler SUR l'organisation, c'est questionner la gouvernance.<br>
    Questions : <br>
    Comment allons-nous décider ? Quelles sont les autorités requises ? Quels processus devrons-nous suivre ? Qui décide de quoi ?
    Comment pouvons-nous changer toutes ces réponses ? Comment le travail qui est à faire est-il défini et affecté ?
    Quelles politiques allons-nous suivre dans notre travail ?<br>
<br>
Roles spécifiques de la réunion de gouvernance : <br>
- facilitateur et secrétaire. tenus par des personnes elues en réunion de gouvernance selon le "processus d'election intégrative".<br>
- pour débuter, on peut faire appel à un facilitateur extérieur expérimenté.<br>
- l'expérience du facilitateur est déterminante pour le succès, il est le garant du processus.<br><br>
Une réunion de Gouvernance commence à l'heure & finit à l'heure.<br>
La réunion à lieu quel que soit le nombre de participants & les tensions que ceux-ci amènenet sont toutes traitées.<br>
La réunion de gouvernance suit un protocole strict qui en garantit l'efficacité.<br>
<br>
Le facilitateur doit garantir le respect du processus. et ramener en cas d'égarement<br>
<b>Processus de le réunion de Gouvernance :<b><br>
1. Tour d'inclusion : chacun exprime simplement dans quel état d'esprit il arrive et quel est son niveau de présence en début de réunion.
Porter mon attention sur mon niveau de présence, c'est déjà l'améliorer. Ne pas perdre d'energie a interpréter un visage fermé.
 <br>
2. Points administratifs. (quelques instants) : points pratiques (horaires, heure du déjeuner...)<br>
3. Etablissement de l'ordre du jour. <br>
Facilitateur pose la question : "Quelles sont les tensions que vous voulez traiter? réponse en un ou deux mots".
les participants nourissent l'ordre du jour SANS expliquer le contenu de leur tension. exemple "Fleurs", "Prérequis", "Fournitures".<br>
Ce titre / mot en lui même n'a aucun intérêt.<br>

<br>
4. Traitement de chaque tension. On traite les tensions une à une dans l'ordre énoncé. exemple "Prérequis" apporté par "Léa"<br>
4a. Présentation. "Ma tension concerne le rôle "Support Client", il laisse s'inscrire des personnes qui n'ont pas les "Prérequis".
Celui qui apporte la tension doit également faire une "Proposition" même toute simple "Qu'on verifie si les participants ont bien les prérequis ".
L'important est d'avancer d'un pas pour apprendre et ajuster en marchant. Toute proposition initiale est OK en holacratie. La proposition est notée.<br>
 <br>
4b. Clarifications. Facilitateur demande : "Y'a-t-il des questions de clarification ?" .<br>
rythmée en trois temps (garanti par le facilitateur, ne doit pas glisser en discussion libre) : Une Question -> Une réponse de l'apporteur proposeur, pause. <br>
Une question de clarification est seulement  une demande d'information. ex : une question "Ne crois-tu pas ..." n'est pas une question de clarification mais une réaction qui sera traitée plus tard.<br>
Une bonne question serait "Combien de stagiaires n'ont pas les prérequis ? ". Le proposeur/apporteur a le droit de ne pas avoir la réponse aux questions de clarifications.<br>
Facilitateur : "Y'a-t-il d'autres questions de clarification?".<br>
4c. Réactions. Le facilitateur interroge tour à tour chaque participant : "Quelle est ta réaction?" -> les participants expriment ce qu'ils veulent factuel ou emotionnel, court ou long, il s'agit juste de ne pas engager de discussion.
 Chacun s'exprime comme s'il était seul s'adresser à l'espace impersonnel de la réunion, évitant les "TU" qui appeleraient une réaction. Le tour de réaction permet à
  chacun de réagir à la proposition telle qu'elle est écrite au tableau. Chacun peut vider son sac, mais personne n'embraye en réagissant.<br>
4d. Amendements. "Proposeur, suite aux réactions, souhaites-tu clarifier et/ou amender ta proposition ?"<br>
4e. Objections. "Voyez-vous une raison qui fait que l'adoption de cette proposition causerait du tort ou ferait regresser l'organisation ?" Oui/Non . nul ne pourra dire qu'il n'a pas pu s'exprimer. Le facilitateur
peut tester l'objection afin de vérifier que cette objection remplit bien les critères de validité tels que défini par la constitution. S'assurer que l'évolution de l'organisation ne sera pas bloquée par des
réactions égotiques. : "Quel tort serait causé à l'organisation ?". "Si on supprime la proposition, la tension existe-t-elle encore ? Oui/non ?" Voir si
l'objection ne serait pas une autre tension à porter à l'ordre du jour. <br>
Le facilitateur doit veiller à ce que la proposition soit un délivrable valide de gouvernance au regard de la consitution.
4f. Intégration. (des objections) : Un délivrable de Gouvernance : En gouvernance, on ne parle que de création de rôles, de suppression de rôles, de modification des rôles. <br>
Facilitateur : "Quelles sont les autorités en jeu ici ? " -> Cette phrase donne lien à la première discussion ouverte. réponse : "Support Client" & "Conception formation"
-> il faudrait modifier le rôle "conception de formation" en lui ajoutant une redevabilité : "définir et publier les prérequis".
et transformer la première redevabilité du "support client" en "faciliter la vente des inscriptions en formation en vérifiant que les prérequis sont respectés".
La proposition "verifier les prerequis" devient ajout d'une redevabilité et modif d'une autre.<br>
 On intègre toutes les objections, puis on revient à l'étape précédente pour un nouveau tour d'objections jusqu'à ce qu'il n'y ait plus d'objection.<br>
 Chaque point à l'ordre du jour est traité selon le même processus. Si d'autres tensions apparaissent, il est possible de les ajouter à la liste.<br>
 Si nécessaire, une réunion exceptionnelle est programmée.<br>

 <br>
 Quand une organisation commence en Holacratie, elle passe souvent par trois étapes : <br>
 1 d'abord personne n'ose parler, aucune tension ne s'exprime.<br>
 2 puis les vannes s'ouvrent et d'innobrables tension sont exprimées. Quelques longues réunions sont nécessaires, il faut drainer les toxines de l'organisation.<br>
 3 enfin les choses se régulent et un rythme naturel plus aisé se met en place après quelques semaines, les tensions exprimées sont alors d'une autre qualité.<br>
 <br>

5. Tour de clôture.<br>
Toute réunion se termine par un tour comme elle a commencé, ce qui permet à chacun de porter un regard évaluatif sur la réunion.<br>
Prendre du recul sur ce qui vient de se passer. Chacun dépose ce qu'il a à dire, il n'est pas permis de réagir. Le tour de clôture ne doit pas tourner en discussion.<br>

<br>



<br>
La réunion de Gouvernance n'est pas une séance "d'intelligence collective" où l'on viserait à trouver ensemble la meilleure solution possible. On veut seulement une décision pratiquable tout de suite.<br>
    <br>
    Hello from<b>${this.name}</b><br>
    debug : ${this.debug}<br>
    config :
    <pre> ${JSON.stringify(this.config, undefined, 2)}</pre><br>
    </div>


    `;
  }

  firstUpdated(){
    var app = this;
    this.agent = new HelloAgent(this.name);
    console.log(this.agent)
    this.agent.receive = function(from, message) {
      //  console.log("messah",message)
      if (message.hasOwnProperty("action")){
        //  console.log(message)
        switch(message.action) {
          case "configChanged":
          app.configChanged(message.config)
          break;
          default:
          console.log("Unknown action ",message)
        }
      }
    };
  }

  configChanged(config){
    this.config = config
    console.log(this.config)
  }

}

customElements.define('reunion-gouvernance-view', ReunionGouvernanceView);
