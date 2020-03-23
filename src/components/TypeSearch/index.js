import React, { useState, useRef } from 'react'
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import axios from 'axios';
import './styles.css';

export default function TypeSearch() {

    const API_URL = "http://localhost:8000";

    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const inputRef = useRef(null);

    const getInfo = () => {
        console.log("getInfo");
        
        let urlQuery = "";

        if (/^[a-zA-ZÁÀÉÍ]*$/.test(query)) {
            urlQuery = `CLI_NOME_like=${query}`;
        } else if (/^[0-9]*$/.test(query)) {
            urlQuery = `CLI_CNPJ_CPF_like=${query}`;
        } else {
            return;
        }

        axios.get(`${API_URL}/clientes?${urlQuery}`)
        .then(({ data }) => {
            // console.log('response', data);            
            setResults(data);
        })
    }
    // https://github.com/slorber/awesome-debounce-promise
    const searchAPIDebounced = AwesomeDebouncePromise(getInfo, 700);

    const handleInputChange = (value) => {
        console.log("handleInputChange");
        
        setQuery(value.toUpperCase());

        if (value && value.length > 2) {
            // getInfo();
            searchAPIDebounced();
            
        } else {
            setResults([]);
        }
    }

    const selectResult = (searchResult) => {
        console.log("selectResult");
        
        setQuery(searchResult.CLI_NOME);
        setResults([]);
        inputRef.current.value = searchResult.CLI_NOME;
        
    }

    const cleanInput = () => {
        inputRef.current.value = "";
        setQuery("");
        setResults([]);
    }
    
    return (
        <form>
            <div className="search-container">

                <div className="input-container">
                    <input 
                        ref={inputRef}
                        placeholder="Pesquisar..."
                        className="search-inputs"                    
                        onChange={(e) => { handleInputChange(e.target.value) }}
                    />
                    
                    <div className="close-button">
                        <span onClick={() => { cleanInput() }}>Limpar</span>
                    </div>
                </div>
                

                {results.length > 0 &&
                    (
                        <div className="results-container">
                            <ul>
                                {
                                    results.map(result => (
                                        <li key={result.id} onClick={() => { selectResult(result) }}>
                                            {result.CLI_NOME} - {result.CLI_CNPJ_CPF}                                            
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                    )
                }



            </div>

            <p>{query}</p>
        </form>
    )
}
