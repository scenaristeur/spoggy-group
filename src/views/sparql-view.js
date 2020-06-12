import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';
import { fetchDocument } from "tripledoc";
import * as jsonld from 'jsonld';



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
    this.debug = false
    this.params = {}
  }

  render(){
    return html`
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
    <link href="css/fontawesome/css/all.css" rel="stylesheet">

    <div class="container-fluid">
    <h2>test connexion semapps</h2>
    gestion sparql : <a href="http://localhost:9000/?source=http://localhost:3000/sparql/&query=SELECT%20?subject%20?predicate%20?object%20WHERE%20{?subject%20?predicate%20?object}LIMIT%2025">http://localhost:9000/?source=http://localhost:3000/sparql/&query=SELECT%20?subject%20?predicate%20?object%20WHERE%20{?subject%20?predicate%20?object}LIMIT%2025</a><br>
    <br>
    <a href="http://localhost:9000/?source=http://localhost:3000/sparql/&query=SELECT+%3Fsubject+%3Fpredicate+%3Fobject%0AWHERE+%7B%0A++%3Fsubject+%3Fpredicate+%3Fobject.%0A++%3Fsubject+%3Chttp%3A%2F%2Fxmlns.com%2Ffoaf%2F0.1%2FfirstName%3E+%22Bob%22.%0A%7D%0A">http://localhost:9000/?source=http://localhost:3000/sparql/&query=SELECT+%3Fsubject+%3Fpredicate+%3Fobject%0AWHERE+%7B%0A++%3Fsubject+%3Fpredicate+%3Fobject.%0A++%3Fsubject+%3Chttp%3A%2F%2Fxmlns.com%2Ffoaf%2F0.1%2FfirstName%3E+%22Bob%22.%0A%7D%0A</a><br>
    <br>
    gestion source/file : <a href="http://localhost:9000/?source=https://holacracy.solid.community/public/spoggy/Organization/">http://localhost:9000/?source=https://holacracy.solid.community/public/spoggy/Organization/</a> <br>
    <br>  ou <a href="http://localhost:9000/?source=https://holacracy.solid.community/public/spoggy/Organization/lemonade%20enthusiasts%20club/index.ttl#this">https://holacracy.solid.community/public/spoggy/Organization/lemonade%20enthusiasts%20club/index.ttl#this</a>
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
    if(this.params.ldp != undefined){
      this.type = "ldp"
    }
    if(this.params.source != undefined){
      this.type = "source"
    }
    if (this.params.query != undefined && this.params.source != undefined){
      this.type = "endpoint"
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
      case "ldp":
      //https://colibris.social/themes
      //https://colibris.social/actors
      const nquads = await jsonld.toRDF(this.params.ldp, {format: 'application/n-quads'});
      let quadsArray = nquads.split(/\r?\n/)
    //  console.log("quads", quadsArray)
      let triplets = []
      quadsArray.forEach((q, i) => {
         q=q.slice(0, -1).trim()
        let t_array = q.split(" ")
      //  console.log("array",t_array)

      if (t_array.length > 2) {

       let t = {}
        t.subject = {}
        t.predicate = {}
        t.object = {}

        t.subject.id = t_array.shift().slice(1, -1).trim()
        t.predicate.id = t_array.shift().slice(1, -1).trim()
        t.object.id = t_array.join(" ")
      //  console.log(t)
        t.object.id = t.object.id.startsWith('\"') && t.object.id.endsWith('\"') ? t.object.id.slice(1, -1).trim() : t.object.id.slice(1, -1).trim()
        triplets.push(t)
        this.agent.send("Vis", {action: "triplesChanged", triples: triplets})
      }
        //
        //quadsArray[i] = q
      });
      console.log("TRIPLETS", triplets)
this.agent.send("Vis", {action: "triplesChanged", triples: triplets})
      //console.log("PARAMS",this.params.source)
      /*  const rawResponse1 = await fetch(this.params.ldp, {
      method: 'GET',
      headers: {
      'Accept': 'application/ld+json',
      //  'Content-Type': 'application/json'
    },
    //  body: this.params.query
  });
  const triples1 = await rawResponse1.json();
  console.log(triples1);*/
  //  this.agent.send("Vis", {action: "triplesSemapps", triples: triples})
  break;
  case "endpoint":
  //console.log("PARAMS",this.params.source)
  const rawResponse = await fetch(this.params.source, {
    method: 'POST',
    headers: {
      'Accept': 'application/ld+json',
      //  'Content-Type': 'application/json'
    },
    body: this.params.query
  });
  const triples = await rawResponse.json();
  console.log(triples);
  this.agent.send("Vis", {action: "triplesSemapps", triples: triples})
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
