import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';

class CockpitView extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      debug: {type: Boolean},
      config: {type: Object}
    };
  }

  constructor() {
    super();
    this.name = "CockpitView"
    this.debug = true
    this.config = {}
  }

  render(){
    return html`
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
    <link href="css/fontawesome/css/all.css" rel="stylesheet">

    <div class="container-fluid">
    <div class="row">
    
    <div class="col">
    <checklists-view name="Checklists"><checklists-view>
    </div>

    <div class="col">
    <indicateurs-view name="Indicateurs"></indicateurs-view>
    </div>
    </div>

    <div class="row">
    <projets-view name="Projets"></projets-view>
    </div>

    <div class="row">
    <reunions-view name="Reunions"></reunions-view>
    </div>

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

customElements.define('cockpit-view', CockpitView);
