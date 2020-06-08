import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';

class RoleView extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      debug: {type: Boolean},
      config: {type: Object},
      url: {type: String},
      domainShape: {type: Object},
      redevabilityShape: {type: Object}
    };
  }

  constructor() {
    super();
    this.name = "Role"
    this.debug = true
    this.config = {}
    this.url = ""
    this.domainShape = {
      name: "New Domaine",
      object_type: "Domain",
      fields: [
        {label: "Name", type: "input", id: "name"},
        {label: "Purpose", type: "textarea", id: "purpose", value: ""},
        {label: "Attributed to", type: "select",
        id: "attributedTo",
        source:"https://holacracy.solid.community/public/spoggy/Role/",
        add: true, value: this.url},

      ]
    },
    this.redevabilityShape = {
      name: "New Redevability",
      object_type: "Redevability",
      fields: [
        {label: "Name", type: "input", id: "name"},
        {label: "Purpose", type: "textarea", id: "purpose", value: ""},
        {label: "Attributed to", type: "select",
        id: "attributedTo",
        source:"https://holacracy.solid.community/public/spoggy/Role/",
        add: true, value: this.url},
      ]
    }
  }

  render(){
    return html`
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
    <link href="css/fontawesome/css/all.css" rel="stylesheet">

    <div class="container-fluid">
    [list of tensions that this role must process]<br>
    [list of tensions that this role has created]<br>
    [purpose]<br>
    [redevabilities]<br>
    <liste-view name="Redevabilities" .shape="${this.redevabilityShape}" parent="${this.url}"></liste-view>

    [domains]<br>
    <liste-view name="Domains" .shape="${this.domainShape}" parent="${this.url}"></liste-view>

    [ people that enroll this role]<button class="btn btn-outline-primary" @click="${this.enroll}">Enroll</button>


    </div>


    <div ?hidden = "${!this.debug}">
    <hr>
    https://labdsurlholacracy.com/bande-dessinee-holacracy#page-94-95.<br>
    Une persone a en charge un ou plusieurs Roles.<br>
    exemple de rôle : formation <br>
    Un rôle : <br>
    - c'est une raison d'être, ex : "developper les compétences requises pour applique la méthode par des formations impecables".<br>
    - contrôle un ou plusieurs domaines : "personne n'a le droit de toucher au programme de formation sans mon autorisation".<br>
    - des redevabilités = activités attendues de ce rôle. ex: planifier des séminaires et formations tout public en se basant sur les demandes du marché, fournies par le rôle "Marketting".<br>
    <br>
    -> Raison d'être, Domaines, Redevabilités.<br>
    exemples de rôles : <br>
    - Philippe : role "Marketting" et rôle "support client".<br>
    - Luc : rôle "gestion de site web" et rôle "Coaching".<br>
    - Adriana : rôle "finances" et rôle "conception des formations".<br>

    <br>
    Roles spécifique à une réunion de gouvernance : Facilitateur (expérimenté), secrétaires. Elus par le "processus d'election intégrative".<br>





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

customElements.define('role-view', RoleView);
