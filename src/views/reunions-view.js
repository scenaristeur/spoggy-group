import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';

class ReunionsView extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      reunions: {type: Array}
    };
  }

  constructor() {
    super();
    this.name = "reunions"
    this.reunions = [
      {summary: "Première réunion de gouvernance", type: "gouvernance", start: "2020-04-07", end: "2020-04-07"},
      {summary: "Première réunion de triage", type: "triage", start: "2020-04-08", end: "2020-04-08"}

    ]
  }

  render(){
    return html`
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
    <link href="css/fontawesome/css/all.css" rel="stylesheet">

    <div class="container-fluid border border-info rounded mt-3">
    <h4>Réunions <i class="fas fa-plus-circle"></i></h4>
    <div style="max-height:30vh; width:100%; overflow: auto">
    <ul class="list-group">
    ${this.reunions.map((r) =>
      html`
      <li class="list-group-item ">
      ${r.start}: ${r.summary}
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

customElements.define('reunions-view', ReunionsView);
