import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';
import { fetchDocument } from "tripledoc";

//const auth    = require('solid-auth-cli') // or browser equivalent
//import {RDFeasy} from'rdf-easy'       // or browser equivalent

class SparqlView extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      debug: {type: Boolean},
      params: {type: Object}
    };
  }

  constructor() {
    super();
    this.name = "Sparql"
    this.debug = true
    this.params = {}


//    this.rdf = new RDFeasy(solid.auth)
  }

  render(){
    return html`
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
    <link href="css/fontawesome/css/all.css" rel="stylesheet">

    <div class="container-fluid">
    gestion sparql : http://localhost:9000/?source=http://127.0.0.1:3030/localData/query&query=SELECT%20?subject%20?predicate%20?objectWHERE%20{?subject%20?predicate%20?object}LIMIT%2025<br>
    gestion source/file : http://localhost:9000/?source=https://holacracy.solid.community/public/spoggy/Organization/ <br>
    ou https://holacracy.solid.community/public/spoggy/Organization/lemonade%20enthusiasts%20club/index.ttl#this
    </div>


    <div ?hidden = "${!this.debug}">
    <hr>
    Hello from<b>${this.name}</b><br>
    debug : ${this.debug}<br>
    params :
    <pre> ${JSON.stringify(this.params, undefined, 2)}</pre><br>
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
    this.init()
  }

  async init(){
    this.params = this.recupParams();
    console.log("PARAMS",this.params)

    this.type = ""
    if(this.params.source != undefined){
      this.type = "source"
    }
    if (this.params.query != undefined && this.params.source != undefined){
      this.type = "endpoint"
    //  let results1 = await this.rdf.query( this.params.source, this.params.query )
    //  console.log("RESULTS",results1)
    }

    switch (this.type) {
      case "source":
      try{
        const doc = await fetchDocument(this.params.source);
        this.agent.send("Vis", {action: "currentFileChanged", currentFile: this.params.source})
        //  console.log("doc",doc)
        let triples = doc.getTriples()
        console.log("triples",triples)
        //  let vis_network = this.statements2vis(triples)
        this.agent.send("Vis", {action: "triplesChanged", triples: triples})
      }
      catch(e){
        console.log(e)
        alert("Oh i've got a problem to read this file :-(")
      }
      break;

      default:
      console.log("todo", this.type)
    }
    //https://cdn.jsdelivr.net/npm/rdflib@latest


  }

  recupParams(){
    console.log(window.location)
    var url = window.location.search+window.location.hash;  // pour catcher les /card#me
    var params = (function(a) {
      if (a == "") return {};
      var b = {};
      for (var i = 0; i < a.length; ++i)
      {        var p=a[i].split('=', 2);
      if (p.length == 1)
      b[p[0]] = "";
      else
      b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
    }
    return b;
  })(url.substr(1).split('&'));
  return params;
}

configChanged(config){
  this.config = config
  console.log(this.config)
}

}

customElements.define('sparql-view', SparqlView);
