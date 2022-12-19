import './App.css';
import logoApp from "assets/debugalizer.png";
import jsIcon from "assets/jsicone.png";
import javaIcon from "assets/javaicone.png";
import phpIcon from "assets/phpicone.png";
import pythonIcon from "assets/pythonicone.png";
import maximise from "assets/maximize.png";
import run from "assets/play.png";
import copy from "assets/copy.png";
import React from 'react';
import axios from 'axios';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import bootcodes from 'languages.json';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FullScreen, useFullScreenHandle } from "react-full-screen";

const hightlightWithLineNumbers = (input: string, language: Prism.Grammar, programmingLanguage: string) =>
  Prism.highlight(input, language, programmingLanguage)
    .split("\n")
    // .map((line, i) => `<span class='editorLineNumber'>${i + 1}</span>${line}`)
    .join("\n");

function App() {
  const [code, setCode] = React.useState(bootcodes.js);
  const [file, setFile] = React.useState('main.js');
  const [language, setLanguage] = React.useState('javascript');
  const [output, setOutput] = React.useState('');
  const [error, setError] = React.useState(false);
  const openInFullScreen = useFullScreenHandle();
  const notify = () => toast.success('🦄 code copied to clipboard!', {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
  });
  const compileAndRunCode = async () => {
    try {
      const response = await axios.post('http://localhost:5000/compileAndRun', {
        code: code,
        language: language
      });
      setOutput(response.data);
      setError(false);
    } catch (error: any) {
      setError(true);
      setOutput(error.response.data);
    }
  }

  return (
    <div className="App">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      {/* Same as */}
      <ToastContainer />
      <main className="App-header">
        <div className="flex-container">
          <div className="flex-item-left threeD"><img src={logoApp} className="App-logo" alt="applicationLogo" /></div>
          <div className="flex-item-right">2</div>
        </div>
        <div className="flex-container">
          <div className="flex-item-right flex-container">
            <div className="flex-item languages">
              <img src={jsIcon} onClick={() => {
                setCode(bootcodes.js);
                setFile("main.js");
                setLanguage("javascript");
              }} alt="programmingLanguage" className='programmingLanguage' />
              <br />
              <img src={javaIcon} onClick={() => {
                setCode(bootcodes.java);
                setFile("main.java");
                setLanguage("java");
              }} alt="programmingLanguage" className='programmingLanguage' />
              <br />
              <img src={phpIcon} onClick={() => {
                setCode(bootcodes.php);
                setFile("main.php");
                setLanguage("php");
              }} alt="programmingLanguage" className='programmingLanguage' />
              <br />
              <img src={pythonIcon} alt="programmingLanguage" onClick={() => {
                setCode(bootcodes.python);
                setFile("main.py");
                setLanguage("python")
              }} className='programmingLanguage' />
            </div>
            <FullScreen handle={openInFullScreen} className="flex-item-right">
              <div>
                <div className="editorHead">
                  <span className="editorFileName">{file}</span>
                  <span className="editorTools">
                    <img src={maximise} className="toolsIcon" alt="maximise" onClick={() => {
                      if (openInFullScreen.active) {
                        openInFullScreen.exit();
                      } else {
                        openInFullScreen.enter();
                      }
                    }} />
                    <CopyToClipboard text={code} onCopy={() => notify()}>
                      <img src={copy} className="toolsIcon" alt="copy" />
                    </CopyToClipboard>
                    <img src={run} className="toolsIcon" alt="run" onClick={() => compileAndRunCode()} />
                  </span>
                </div>
                <Editor
                  value={code}
                  onValueChange={code => setCode(code)}
                  highlight={code => hightlightWithLineNumbers(code, Prism.languages.js, 'javascript')}
                  padding={10}
                  className="editor"
                  style={{
                    fontFamily: '"Fira code", "Fira Mono", monospace',
                    fontSize: 16,
                    color: 'white',
                    backgroundColor: 'black',
                    height: '500px',
                  }}
                />
              </div>
            </FullScreen>
          </div>
          <div className="flex-item-right">
            <div className="output">
              <p className="outputComm">{"// Output"}</p>
              <p style={error ? { color: 'red' } : {}}>{output}</p>
            </div>
          </div>
        </div>
      </main >
    </div >
  );
}

export default App;
