import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';

class InputView extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      debug: {type: Boolean},
      webId: {type: String},
      triples: {type: Array},

    };
  }

  constructor() {
    super();
    this.name = "Input"
    this.debug = false
    this.webId = null
    this.triples = []
  }

  render(){

    const triplesList = (triples) => html`
    <ul class="list-group list-group-flush" style="height: 30vh; width:100%; overflow: auto">
    ${triples.map((t) => html`
      <li class="list-group-item">
      <div class="row">
      <button class="btn btn-outline-secondary btn-sm" type="button">${t.subject}</button>
      <button class="btn btn-outline-secondary btn-sm" type="button">${t.predicate}</button>
      <button class="btn btn-outline-secondary btn-sm" type="button">${t.object}</button>
      <!--[edit] [delete]-->
      </div>
      </li>
      `)}
      </ul>
      `;


      return html`
      <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
      <link href="css/fontawesome/css/all.css" rel="stylesheet">

      <!--  <div ?hidden="${this.webId == null}"> -->
      <div  class="row">
      <div class="container-fluid">
      <div class="input-group mb-3">
      <!--<div class="input-group-prepend">
      <span class="input-group-text" id="input-label">?</span>
      </div>-->
      <input type="text" class="form-control"
      id="tripleInput"
      placeholder="'Subject predicate Object,' ending with , ; . or - or command starting by '/'"
      aria-label="'Subject predicate Object,' ending with , ; . or - or command starting by '/'"
      title="'Subject predicate Object,' ending with , ; . or - or command starting by '/'"
      aria-describedby="input-label"
      @keydown=${this.keydown}>
      <div class="input-group-append">
      <button class="btn btn-outline-primary" @click="${this.add_triple}" type="button">Add</button>
      </div>
      </div>
      </div>
      </div>



      <div class="row">
      ${this.triples.length > 0 ?
        html `  ${triplesList(this.triples)}`
        :html `
        <small>
        You can add triples to your Spog.<br>
        To do so, just type 3 words in the above input and ends with a :
        <ul>
        <li>comma (,) if you want to keep subject & predicate, </li>
        <li>semicolon (;) if you want to keep just the subject,</li>
        <li>dot (.) if you don't want to keep anything,</li>
        <li>dash (-) if you want that the object become the subject of the next triple.</li>
        </ul>
        ex: Dav a Man,
        </small>
        `
      }
      </div>
      <!--      </div> -->
      `;
    }

    add_triple(){
      var new_triple = this.shadowRoot.getElementById('tripleInput').value.trim()
      if (new_triple.length == 0){
        alert("you can't add an empty Triple")
        return
      }
      console.log(new_triple)
      var res = this.catchCommand(new_triple)
    }

    catchCommand(message){
      if (message.startsWith('/')){
        let command = message.slice(1)
        console.log("command",command)
      }else{
        this.updateInput(message)
      }
    }


    updateInput(message){
      var result = {}
      var inputNew = "";
      let lastChar = message.slice(-1);
      let messageCut = message.slice(0,-1).split(" ");
      let isTriplet = true;
      console.log(messageCut);

      let detectLiteral = "";
      let messageCutTemp = [];
      messageCut.forEach(function(part){
        part = part.trim();
        //  console.log(part);
        if (part.startsWith('"')){
          detectLiteral ="debut";
          //  console.log(detectLiteral);
          messageCutTemp.push(part.substr(1));
        }else if (part.endsWith('"')){
          detectLiteral = "fin";
          //console.log(detectLiteral);
          messageCutTemp.push(messageCutTemp.pop()+" "+part.slice(0,-1));
        }else if (detectLiteral == "debut"){
          //  console.log("recupere le dernier et lui ajoute part" )
          messageCutTemp.push(messageCutTemp.pop()+" "+part)
        }else {
          messageCutTemp.push(part);
        }
      });
      if (messageCutTemp.length > 0){
        messageCut = messageCutTemp;
      }
      switch(lastChar){
        case '.':
        inputNew = "";
        break;
        case ';':
        if (messageCut[0].indexOf(" ") > -1){
          inputNew = '"'+messageCut[0]+'"'+' ';
        }else{
          inputNew = messageCut[0]+' ';
        }
        break;
        case ',':
        if (messageCut[0].indexOf(" ") > -1){
          inputNew = '"'+messageCut[0]+'" ';
        }else{
          inputNew = messageCut[0]+' ';
        }
        if (messageCut[1].indexOf(" ") > -1){
          inputNew += '"'+messageCut[1]+'" ';
        }else{
          inputNew += messageCut[1]+' ';
        }
        break;
        case '-':
        if (messageCut[2].indexOf(" ") > -1){
          inputNew = '"'+messageCut[2]+'"'+' ';
        }else{
          inputNew = messageCut[2]+' ';
        }
        break;
        default:
        console.log("message to chat "+message)
        //this.sendMessage(message);
        //  this.agentInput.send('agentSocket', {type: "sendMessage", message:message});
        //  this.catchTriplet(message.slice(0,-1), this.network); // A REMPLACER PAR CATCHTRIPLETS V2
        inputNew = "";
        isTriplet = false;
      }
      if (isTriplet){
        //  console.log("est Triplet",messageCut)
        result.type = "triplet";
        var tripletvalue = {};
        tripletvalue.subject = messageCut[0];
        tripletvalue.predicate = messageCut[1];
        tripletvalue.object = messageCut[2];
        result.value = tripletvalue;
        result.inputNew = inputNew;
      }else {
        //  console.log("n'est pas triplet")
        result.type = "message";
        result.value = message;
        result.inputNew = inputNew;
      }

      //  console.log(res)
      this.shadowRoot.getElementById('tripleInput').value = result.inputNew
      if (result.type == "triplet"){
        //  var triple = result.value
        //  this.triples.reverse()
        this.triples = [result.value, ...this.triples]
        //  this.triples.reverse()
        console.log(this.triples)
        console.log(result)
        this.agent.send("Browser", {action: "addTriple", triple: result.value})
      }else{
        alert ("Triple is an association of three words (subject, predicate, object) & must end with ',' or ';' or '.' or '-' ")
      }
    }


    keydown(e){
      if ( e.which === 13 ) {
        this.add_triple()
        e.preventDefault();
        return false;
      }
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
            case "webIdChanged":
            app.webId = message.webId
            break;
            default:
            console.log("Unknown action ",message)
          }
        }
      };
    }



  }

  customElements.define('input-view', InputView);
