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
Facilit : "Y'a-t-il d'autres questions de clarification?".<br>
4c. Réactions.<br>
4d. Amendements.<br>
4e. Objections.<br>
4f. Intégration.<br>
5. Tour de clôture.<br><br>

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
