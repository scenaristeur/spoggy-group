import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';

class SelectedView extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      selected_nodes: {type: Array},
      selected_edges: {type: Array},
    };
  }

  constructor() {
    super();
    this.name = "Selected"
    this.selected_nodes = []
    this.selected_edges = []
  }

  render(){
    return html`
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">

    <div ?hidden="${this.selected_nodes.length == 0}">
    <hr>
    <b>${this.selected_nodes.length} nodes.</b>
    <hr>
    ${this.selected_nodes.map((n, i) =>
      html`
      <node-view name="${'Node_'+i}" .node="${n}"></node-view>
      `
    )}
    </div>

    <div ?hidden="${this.selected_edges.length == 0}">
    <hr>
    <b>${this.selected_edges.length} edges.</b>
    <hr>
    ${this.selected_edges.map((e, i) =>
      html`
      <edge-view name="${'Edge_'+i}" .edge="${e}"></edge-view>
      `
    )}
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
          case "selectedChanged":
          app.selected_nodes = message.nodes
          app.selected_edges = message.edges
          break;
          default:
          console.log("Unknown action ",message)
        }
      }
    };
  }


}

customElements.define('selected-view', SelectedView);
