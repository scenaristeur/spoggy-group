import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';

class OrganizationView extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      debug: {type: Boolean},
      vocabs: {type: Array},
      fields: {type: Array}
    };
  }

  constructor() {
    super();
    this.name = "Orga"
    this.debug = true
    this.vocabs = [
      {name: "The Organization Ontology", url:"https://www.w3.org/TR/vocab-org/", ns: "http://www.w3.org/ns/org#" }
    ]
    this.shape = [
      {name: "org:Organization skos:prefLabel 'Literal'" },
      {purpose: "org:Organization org:purpose* 'Literal'"}

    ]
  }

  render(){
    return html`
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
    <link href="css/fontawesome/css/all.css" rel="stylesheet">

    <div class="container-fluid">

    vocabs : ${this.vocabs.map(v => html`<pre> ${JSON.stringify(v, undefined, 2)}</pre><br>`)}

    shape: <br>
    ${this.shape.map(f => html`<pre> ${JSON.stringify(f, undefined, 2)}</pre><br>`)}



    </div>


    <div ?hidden = "${!this.debug}">
    <hr>
    transversalité, coopération, échanges purement professionnels entre rôles,<br>
    https://labdsurlholacracy.com/bande-dessinee-holacracy#page-62-63 <br>
    Différentiation de 4 espaces : Espace de l'organisation , Espace des Rôles-ations,
    Espace des relations humaines, Espace personnel.<br>
    relations de rôle à rôle, architecture holarchique, organique, distribuée.<br>
    Pilotage dynamique, apprendre par essai/erreur.<br>
    En permanence connecté avec la raison d'être de l'organisation, ajustement permanent. (https://labdsurlholacracy.com/bande-dessinee-holacracy#page-72-73)<br>
      tension ressentie par les membres = force d'évolution. une tension est le ressnti d'un écart entre la réalité présente et ce qu'elle pourrait être
      <br>
face à une tension, choisir une solution même imparfaite mais qui permet d'avancer, avoir un feedback et d'apprendre, sans forcément chercher la meilleure solution qui intégrerait toutes les conséquences dans l'avnir.<br>
réunions timeboxées selon la nature des questions.<br>
Reunion stratégie : tous les semestres pour s'organiser, clarifications des initiatives et des offres.<br>
Réunion Gouvernance : tous les mois pour s'organiser, clarification des rôles, des redevabilités, et politiques.<br>
Réunion Opérations (triage) : toutes les semaines, voir tous les jours pour se synchroniser, clarification des projets et des prochaines actions.<br>
L'ordre du jour des réunions n'est jamais défini à l'avance, il est établi en début de réunion à partir des tensions effectivement ressenties par les participants.<br>
Toute tension ressentie par qui que ce soit puisse être traitée de façon rapide & fiable afin d'être transformée en évolution de l'organisation qui fasse sens.<br>
Chaque réunion obéit à 2 principes essentiels : TOUTES les tensions sont prises en compte, on traite UNE tension à la fois.<br>
https://labdsurlholacracy.com/bande-dessinee-holacracy#page-88-89.<br>

<br>
Quand une organisation commence en Holacratie, elle passe souvent par trois étapes : <br>
1 d'abord personne n'ose parler, aucune tension ne s'exprime.<br>
2 puis les vannes s'ouvrent et d'innobrables tension sont exprimées. Quelques longues réunions sont nécessaires, il faut drainer les toxines de l'organisation.<br>
3 enfin les choses se régulent et un rythme naturel plus aisé se met en place après quelques semaines, les tensions exprimées sont alors d'une autre qualité.<br>
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

customElements.define('organization-view', OrganizationView);
