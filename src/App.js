import React, {useState} from 'react';
import './App.css';

function App() {

  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [hours, setHours] = useState(0);
  const [arrests, setArrests] = useState(0);
  const [citations, setCitations] = useState(0);
  const [order, setOrder] = useState(0);

  const [situationInputs, setSituationInputs] = useState([]);
  
  const [arrestInputs, setArrestInputs] = useState([]);

  const [trafficInputs, setTrafficInputs] = useState([]);

  const [impoundInputs, setImpoundInputs] = useState([]);

  const monthNames = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

    function CustomAlert(){
    this.alert = function(message,title){
      document.body.innerHTML = document.body.innerHTML + '<div id="dialogoverlay"></div><div id="dialogbox" class="slit-in-vertical"><div><div id="dialogboxhead"></div><pre id="dialogboxbody"></pre><div id="dialogboxfoot"></div></div></div>';
  
      let dialogoverlay = document.getElementById('dialogoverlay');
      let dialogbox = document.getElementById('dialogbox');
      
      let winH = window.innerHeight;
      dialogoverlay.style.height = winH+"px";
      
      dialogbox.style.top = "100px";
  
      dialogoverlay.style.display = "block";
      dialogbox.style.display = "block";
      
      document.getElementById('dialogboxhead').style.display = 'block';
  
      if(typeof title === 'undefined') {
        document.getElementById('dialogboxhead').style.display = 'none';
      } else {
        document.getElementById('dialogboxhead').innerHTML = '<i class="fa fa-exclamation-circle" aria-hidden="true"></i> '+ title;
      }
      document.getElementById('dialogboxbody').innerHTML = message;
      document.getElementById('dialogboxfoot').innerHTML = '<button class="pure-material-button-contained active" onclick="customAlert.ok()">OK</button>';
    }
    
    this.ok = function(){
      document.getElementById('dialogbox').style.display = "none";
      document.getElementById('dialogoverlay').style.display = "none";
    }
  }
  
  let customAlert = new CustomAlert();
  
  const handleChangeInput = (index, e) => {
    const values = [...situationInputs];
    values[index][e.target.name] = e.target.value;
    setSituationInputs(values);
  };

  const handleChangeOutcome = (index, e) => {
    const values = [...situationInputs];
    values[index][e.target.name] = e.target.checked;
    setSituationInputs(values);
  }

  const handleSubmit = () => {
    let dutyDate = new Date(date);
    let day = dutyDate.getDate().toString().length === 1 ? '0' + dutyDate.getDate() : dutyDate.getDate();
    let month = monthNames[dutyDate.getMonth()];
    let year = dutyDate.getFullYear();
    let dateText = `${day}/${month}/${year}`;
    let notesText = '';
    let arrestText = '';
    let impoundText = '';

    for (let i = 0; i <= order; i++) {
      let found = false;
      situationInputs.forEach(situation => {
        if  (situation.order === i) {
          let outcome = '';
          let highlight = '';
          if (situation.outcome) {
            outcome = 'successful';
            highlight = 'lightgreen';
          } else {
            outcome = 'unsuccessful';
            highlight = 'tomato';
          }
          notesText += `[*] [b]${situation.time} - [highlight=${highlight}]${outcome}[/highlight] - ${situation.title}[/b]\n[list=none]\n[i]${situation.text}[/i]\n[/list]\n`;
          found = true;
        }
      });

      if (!found) {
        trafficInputs.forEach(trafficStop => {
          if (trafficStop.order === i) notesText += `[*] [url=${trafficStop.link}]Traffic Stop of a ${trafficStop.vehicle}[/url]\n`;
        });
      }
    }

    arrestInputs.forEach(arrested => {
      arrestText += `[*] [url=${arrested.link}]Arrest Report ${arrested.name}[/url]\n`;
    });

    impoundInputs.forEach(impoundReport => {
      let iText = '';
      if (impoundReport.type === 'release') iText = `Impound Release for ${impoundReport.text}`;
      else if (impoundReport.type === 'impound') iText = `Impound of a ${impoundReport.text}`;

      impoundText += `[*] [url=${impoundReport.link}]${iText}[/url]\n`;
    });

    const dutyReportText = 
`[img]https://i.imgur.com/jIbGT3G.png[/img]

[divbox=white]
[b]Date:[/b] ${dateText}
[b]Hours on Duty:[/b] ${hours}
[b]Start of watch:[/b] ${time} GMT

[b]Arrests:[/b] ${arrests}
[b]Citations:[/b] ${citations}

[b]Notes(Optional):[/b]
[list]
[*] Started patrol under unit [b]11-R-13[/b].
${notesText}
[/list]
[divbox=limegreen][b][u]Arrest Reports[/u][/b]
[list]
${arrestText}
[/list]
[/divbox]

[divbox=darkkhaki][b][u]Impound / Release Reports[/u][/b]
[list]
${impoundText}
[/list]
[/divbox]
[fimg=137,24]https://i.imgur.com/y6kAmMS.png[/fimg]
[/divbox]`;
    
    document.querySelector('.info-p').classList.remove('hidden');
    copyToClipboard(dutyReportText);
    return dutyReportText;
  };

  const handleAddSituation = () => {
    setSituationInputs([...situationInputs, { time: '', outcome: false, title: '', text: '', order: order}]);
    let o = order;
    o += 1;
    setOrder(o);
    console.log(situationInputs);
  };

  const handleRemove = (index) => {
    const values = [...situationInputs];
    values.splice(index, 1);
    setSituationInputs(values);
  }

  const handleRemoveAReport = (index) => {
    const values = [...arrestInputs];
    values.splice(index, 1);
    setArrestInputs(values);
    let a = arrests;
    setArrests(a - 1);
  }

  const handleAddArrest = () => {
    setArrestInputs([...arrestInputs, {link: '', name: ''}]);
    let a = arrests;
    setArrests(a + 1);
  }

  const handleChangeAInput = (index, e) => {
    const values = [...arrestInputs];
    values[index][e.target.name] = e.target.value;
    setArrestInputs(values);
  }

  const handleChangeTInput = (index, e) => {
    const values = [...trafficInputs];
    values[index][e.target.name] = e.target.value;
    setTrafficInputs(values);
  }

  const handleRemoveTReport = (index) => {
    const values = [...trafficInputs];
    values.splice(index, 1);
    setTrafficInputs(values);
    let c = citations;
    setCitations(c - 1);
  }

  const handleAddTraffic = () => {
    setTrafficInputs([...trafficInputs, {link: '', vehicle: '', order: order}]);
    let o = order;
    o += 1;
    setOrder(o);
    let c = citations;
    setCitations(c + 1);
  }

  const handleChangeIInput = (index, e) => {
    const values = [...impoundInputs];
    values[index][e.target.name] = e.target.value;
    setImpoundInputs(values);
  }

  const handleRemoveIReport = (index) => {
    const values = [...impoundInputs];
    values.splice(index, 1);
    setImpoundInputs(values);
  }

  const handleAddImpound = () => {
    setImpoundInputs([...impoundInputs, {link: '', type: 'release', text: ''}]);
  }

  const handleChangeIType = (index) => {
    const values = [...impoundInputs];
    if (values[index]['type'] === 'release') {
      values[index]['type'] = 'impound';
    } else if (values[index]['type'] === 'impound') {
      values[index]['type'] = 'release';
    }
    setImpoundInputs(values);
  }

  const copyToClipboard = str => {
    if (navigator && navigator.clipboard && navigator.clipboard.writeText)
      return navigator.clipboard.writeText(str);
    return Promise.reject('The Clipboard API is not available.');
  };
  
  const handleSelectAll = () => {
    document.querySelector('.output-text-div').select();
  }

  const handleCopy = () => {
    let copyText = document.querySelector('.output-text-div');
    navigator.clipboard.writeText(copyText.value);
  }

  const handleClear = () => {
    document.querySelector('.info-p').classList.add('hidden');

    setDate('');
    setHours(0);
    setTime('');
    setSituationInputs([]);
    setArrestInputs([]);
    setTrafficInputs([]);
    setImpoundInputs([]);

  }

  const handlePopUp = () => {
    let dutyReportText = handleSubmit();
    console.log(dutyReportText);
    customAlert.alert(dutyReportText, 'Duty Report!');
  }

  return (
    <div className='App'>
      <div className='helper-div'>
        <div className='headline-div'>
          <p className='headline-text'>Duty Report Helper</p>
        </div>
        <div className='field'>
          <p>Date</p>
          <input className='date-input' type='date' value={date} onChange={e => setDate(e.target.value)}/>
        </div>
        <div className='field'>
          <p>Hours</p>
          <input className='hours-input' type='number' step="0.1" value={hours} onChange={e => setHours(e.target.value)}/>
        </div>
        <div className='field'>
          <p>Time</p>
          <input className='time-input' type='time' value={time} onChange={e => setTime(e.target.value)}/>
        </div>
        <div className='space'>
        </div>
        <div className='field'>
          <p>Arrests</p>
          <input className='arrests-input' type='number' value={arrests} onChange={e => setArrests(e.target.value)}/>
        </div>
        <div className='field'>
          <p>Citations</p>
          <input className='ticket-input' type='number' value={citations} onChange={e => setCitations(e.target.value)}/>
        </div>
        <div className='space'>
        </div>
        <div className='field'>
          <p>Notes:</p>
        </div>
        <div className='notes-field'>
          {
              situationInputs.map((situationInput, index) => (
                <div className='situation-field' key={index}>
                  <div className='sit-box'>
                    <div className='title-div'>
                      <input className='sittime-input' name='time' placeholder='Time' value={situationInput.time} onChange={e => handleChangeInput(index, e)}/>
                      <input className='outcome-input' name='outcome' placeholder='Outcome' checked={situationInput.outcome} type='checkbox' onChange={e => handleChangeOutcome(index, e)}/>
                      <input className='title-input' name='title' placeholder='Title' value={situationInput.title} onChange={e => handleChangeInput(index, e)}/>
                    </div>
                    <input className='description-input' name='text' placeholder='Description' value={situationInput.text} onChange={e => handleChangeInput(index, e)}/>
                  </div>
                  <button className='remove-button' onClick={() => handleRemove(index)}><span>Remove</span></button>
                </div>
              ))
          }
          <button className='add-button' onClick={handleAddSituation}><span>Add</span></button>
        </div>
        <div className='space'>
        </div>
        <div className='field'>
          <p>Arrest Reports:</p>
        </div>
        <div className='notes-field'>
          {
            arrestInputs.map((arrestInput, index) => (
              <div className='report-field' key={index}>
                <input className='link-input' name='link' placeholder='Link' value={arrestInput.link} onChange={e => handleChangeAInput(index, e)}/>
                <input className='text-input' name='name' placeholder='Name' value={arrestInput.name} onChange={e => handleChangeAInput(index, e)}/>
                <button className='removeReport-button' onClick={() => handleRemoveAReport(index)}><span>Remove</span></button>
              </div>
            ))
          }
          <button className='add-button' onClick={handleAddArrest}><span>Add</span></button>
        </div>
        <div className='field'>
          <p>Traffic Stop Reports:</p>
        </div>
        <div className='notes-field'>
          {
            trafficInputs.map((trafficInput, index) => (
              <div className='report-field' key={index}>
                <input className='link-input' name='link' placeholder='Link' value={trafficInput.link} onChange={e => handleChangeTInput(index, e)}/>
                <input className='text-input' name='vehicle' placeholder='Vehicle' value={trafficInput.vehicle} onChange={e => handleChangeTInput(index, e)}/>
                <button className='removeReport-button' onClick={() => handleRemoveTReport(index)}><span>Remove</span></button>
              </div>
            ))
          }
          <button className='add-button' onClick={handleAddTraffic}><span>Add</span></button>
        </div>
        <div className='field'>
          <p>Impound Reports:</p>
        </div>
        <div className='notes-field'>
          {
            impoundInputs.map((impoundInput, index) => (
              <div className='report-field' key={index}>
                <input className='link-input' name='link' placeholder='Link' value={impoundInput.link} onChange={e => handleChangeIInput(index, e)}/>
                <p className='p-checkbox' name='type' onClick={() => handleChangeIType(index)}>{impoundInput.type}</p>
                <input className='text-input' name='text' placeholder='Text' value={impoundInput.text} onChange={e => handleChangeIInput(index, e)}/>
                <button className='removeReport-button' onClick={() => handleRemoveIReport(index)}><span>Remove</span></button>
              </div>
            ))
          }
          <button className='add-button' onClick={handleAddImpound}><span>Add</span></button>
        </div>
        <div className='createButton-div'>
          <div className='finishButtons-div'>
            <button className='create-button' onClick={handleSubmit}><span>Create</span></button>
            <button className='selectall-button clear' onClick={handleClear}><span>Clear</span></button>
          </div>
          <p className='info-p hidden'>Duty Report copied to clipboard or <span className='popup-span' onClick={handlePopUp}>get text</span> instead.</p>
        </div>
      </div>
      <div className='output-div hidden'>
        <div className='obuttons-div'>
          <div className='selectcopy-div'>
            <button className='selectall-button' onClick={handleSelectAll}>Select All</button>
            <button className='selectall-button copy' onClick={handleCopy}>Copy</button>
          </div>
          <button className='selectall-button clear' onClick={handleClear}>Clear</button>
        </div>
        <div className='output-text-div'>

        </div>
      </div>
      <p className='credits'>Website built by officer Ace Butoslav.</p>
    </div>
  );
}

export default App;
