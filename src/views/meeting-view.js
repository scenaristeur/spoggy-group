import { LitElement, html } from 'lit-element';
import { HelloAgent } from '../agents/hello-agent.js';
import { fetchDocument } from "tripledoc";

class MeetingView extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      folder: {type: String},
      summary: {type: String},
      start: {type: String},
      end: {type: String},
      location: {type: String},
      comment: {type: String}
    };
  }

  constructor() {
    super();
    this.name = "Meet"
    this.folder = ""
    this.summary = ""
    this.start = ""
    this.end = ""
    this.location = ""
    this.comment = ""
  }

  render(){
    return html`
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
    <link href="css/fontawesome/css/all.css" rel="stylesheet">

    <div class="container-fluid">
    <!--folder:  ${this.folder}-->
    <h3><a href="${this.folder}" target="_blank">${this.summary}</a></h3>
    start: ${this.start} end: ${this.end}<br>
    location: ${this.location}<br>
    comment: ${this.comment}<br>
    </div>

    `;
  }

  async firstUpdated(){
    var app = this;
    this.agent = new HelloAgent(this.name);
    //  console.log(this.agent)
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
    await   this.init()
  }

  async init(){
    //  console.log(this.folder)
    if (this.folder.length > 0){
      let index = this.folder+"index.ttl#this"
      console.log(index)
//      try{
        const doc = await fetchDocument(index);

        //  console.log("doc",doc)
        let triples = doc.getTriples()
        //console.log(triples)
        let main = await doc.getSubject(index)
        //  console.log("main",main)
        let created = await main.getDateTime("http://purl.org/dc/elements/1.1/created")
        //  console.log(created)

        this.summary = await main.getLiteral("http://www.w3.org/2002/12/cal/ical#summary")
        this.start = new Date(await main.getLiteral("http://www.w3.org/2002/12/cal/ical#dtstart")).toLocaleString()
        this.end = new Date(await main.getLiteral("http://www.w3.org/2002/12/cal/ical#dtend")).toLocaleString()
        this.location = await main.getLiteral("http://www.w3.org/2002/12/cal/ical#location")
        this.comment = await main.getLiteral("http://www.w3.org/2002/12/cal/ical#comment")

    /*  }catch(e){
        console.log(e)
      }*/


    }

  }

}

customElements.define('meeting-view', MeetingView);
