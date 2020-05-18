import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';

class ProjetsView extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      debug: {type: Boolean},
      projets: {type: Boolean}
    };
  }

  constructor() {
    super();
    this.name = "Projets"
    this.projets = [
      "demarrer l'appli pour combiner Solid & Holacratie",
      "Empêcher les livreurs de dire qu'ils ont livrés qd on ne les a pas vus",
      "Swing a flik flok top",
      "Bling a Bloup",
      "Ring a swing",
      "have a cigar",
      "Crazy diamond shine on you"]
    }

    render(){
      return html`
      <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
      <link href="css/fontawesome/css/all.css" rel="stylesheet">

      <div class="container-fluid border border-info rounded mt-3">
      <h4>Projets <i class="fas fa-plus-circle"></i></h4>
      <div style="max-height:30vh; width:100%; overflow: auto">
      <ul class="list-group">
      ${this.projets.map((p) =>
        html`
        <li class="list-group-item">
        ${p}
        </li>
        `
      )}
      </ul>
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

  customElements.define('projets-view', ProjetsView);
